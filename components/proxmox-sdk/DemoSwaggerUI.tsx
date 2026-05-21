"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export function DemoSwaggerUI() {
  return (
    <div className="proxmox-sdk-demo-swagger min-h-screen bg-white text-black">
      <SwaggerUI
        url="/api/proxmox-sdk-demo/openapi.json"
        deepLinking
        tryItOutEnabled
      />
    </div>
  );
}
