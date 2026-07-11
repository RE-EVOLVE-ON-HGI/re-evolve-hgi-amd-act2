/**
 * Simple health check for Vercel deployments.
 * Returns a JSON object indicating the service is alive.
 * This endpoint does not affect the existing NestJS business logic.
 */
module.exports = (req, res) => {
  // Vercel passes a Node.js request/response pair.
  res.status(200).json({ status: "ok" });
};
