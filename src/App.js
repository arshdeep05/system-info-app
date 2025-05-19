import React, { useState, useEffect, useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
function App() {
  const [sysInfo, setSysInfo] = useState(null);
  const toast = useRef(null);

  const accept = () => {
    toast.current.show({
      severity: "info",
      summary: "Confirmed",
      detail: "You have accepted",
      life: 3000,
    });
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    });
  };

  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept,
      reject,
    });
  };

  const confirm2 = () => {
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };
  useEffect(() => {
    const getSystemData = async () => {
      if (window.electronAPI) {
        const info = await window.electronAPI.getSystemInfo();
        setSysInfo(info);
      }
    };
    getSystemData();
  }, []);

  if (!sysInfo) return <div>Loading system info...</div>;

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="card flex flex-wrap gap-2 justify-content-center">
        <Button
          onClick={confirm1}
          icon="pi pi-check"
          label="Confirm"
          className="mr-2"
        ></Button>
        <Button
          onClick={confirm2}
          icon="pi pi-times"
          label="Delete"
        ></Button>
      </div>

      <h2>System Information</h2>
      <ul className="flex gap-3 flex-column">
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
