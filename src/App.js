import React, { useState, useEffect } from "react";

function App() {
  const [sysInfo, setSysInfo] = useState(null);

  useEffect(() => {
    const getSystemData = async () => {
      if (window.electronAPI) {
        const info = await window.electronAPI.getSystemInfo();
        setSysInfo(info);
      }
    };
    getSystemData()
  }, []);

  if (!sysInfo) return <div>Loading system info...</div>;

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h2>System Information</h2>
      <ul>
        <li>
          <b>Platform:</b> {sysInfo.platform}
        </li>
        <li>
          <b>Architecture:</b> {sysInfo.arch}
        </li>
        <li>
          <b>CPU:</b> {sysInfo.cpu}
        </li>
        <li>
          <b>CPU Count:</b> {sysInfo.cpuCount}
        </li>
        <li>
          <b>Total Memory (GB):</b> {sysInfo.totalMemGB}
        </li>
        <li>
          <b>Free Memory (GB):</b> {sysInfo.freeMemGB}
        </li>
        <li>
          <b>Hostname:</b> {sysInfo.hostname}
        </li>
        <li>
          <b>OS Release:</b> {sysInfo.release}
        </li>
        <li>
          <b>User Info:</b> {sysInfo.userInfo.username}
        </li>
        <li>
          <b>UUID:</b> {sysInfo.uuid}
        </li>
        <li>
          <b>Serial Number:</b> {sysInfo.serialNumber}
        </li>
      </ul>
    </div>
  );
}

export default App;
