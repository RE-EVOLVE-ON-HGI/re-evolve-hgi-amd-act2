#!/usr/bin/env node
import { HgiSdk } from '../sdk/hgi-sdk';

const sdk = new HgiSdk();

const [, , command, ...args] = process.argv;

async function main() {
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  const token = process.env.HGI_TOKEN;
  if (token) {
    sdk.setToken(token);
  }

  try {
    switch (command) {
      case 'login':
        const [email, pwd] = args;
        if (!email || !pwd) {
          console.error('Error: Please provide email and password.');
          console.log('Usage: hgi login <email> <password>');
          return;
        }
        const jwt = await sdk.login(email, pwd);
        console.log('Login successful!');
        console.log(`HGI_TOKEN="${jwt}"`);
        break;

      case 'agents':
        if (args[0] === 'list') {
          const agents = await sdk.listAgents();
          console.log('\n--- HGI AGENT REGISTRY ---');
          agents.forEach((a: any) => {
            console.log(`- [${a.status}] ${a.name} (${a.type}) - Model: ${a.model}`);
          });
          console.log('');
        } else {
          console.log('Unknown agents subcommand. Use: hgi agents list');
        }
        break;

      case 'dispatch':
        const goal = args.join(' ');
        if (!goal) {
          console.error('Error: Please provide a goal prompt to dispatch.');
          console.log('Usage: hgi dispatch "<goal>"');
          return;
        }
        console.log(`Dispatching goal to CENSA Orchestrator: "${goal}"`);
        const orgId = process.env.HGI_ORG_ID || 're-evolve';
        const res = await sdk.dispatchGoal(orgId, goal, {});
        console.log(`\nSuccess! Orchestration triggered:`);
        console.log(`ID: ${res.id}`);
        console.log(`Goal: ${res.goal}`);
        console.log(`Status: ${res.status}`);
        console.log('');
        break;

      default:
        console.error(`Unknown command: ${command}`);
        printHelp();
    }
  } catch (e: any) {
    console.error(`CLI execution failed: ${e.message}`);
  }
}

function printHelp() {
  console.log(`
RE-EVOLVE ON HGI — Command Line Interface

Usage:
  hgi login <email> <password>  Logs in to retrieve access token
  hgi agents list               Lists all registered agents
  hgi dispatch "<goal>"         Dispatches a goal to the multi-agent orchestrator

Environment variables:
  HGI_TOKEN                     Set access token for authentication
  HGI_ORG_ID                    Target organization ID (default: re-evolve)
`);
}

main();
