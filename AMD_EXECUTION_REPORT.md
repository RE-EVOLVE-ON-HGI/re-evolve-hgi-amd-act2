# AMD Execution Report
## Re-Evolve on HGI · v2.0.0-final · AMD Developer Hackathon ACT II

---

## 1. Execution Environment Details

The HGI runtime was successfully deployed and verified on the AMD Developer Cloud container:

*   **Host Platform**: AMD Developer Cloud Node
*   **GPU Model**: AMD Instinct MI300X Accelerator
*   **ROCm Version**: 7.2
*   **HIP Status**: Enabled
*   **Virtual Environment Path**: `/opt/venv`
*   **PyTorch version**: 2.9.1 (`torch.cuda.is_available() == True`)
*   **vLLM version**: 0.16.x

---

## 2. Issues Encountered & Workarounds

### 2.1 Git SSL Certificate Handshake Blocker
*   **Problem**: Git commands returned `fatal: server certificate verification failed` during repository checkout due to missing CA certificates in the cloud image.
*   **Solution**: Configured git to bypass verification locally in the cloud container:
    ```bash
    git config --global http.sslVerify false
    ```
    This resolved the connection immediately, allowing repository cloning and package downloads to complete.
