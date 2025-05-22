import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

export default function AppFooter() {
  return (
    <Footer
      style={{
        backgroundColor: "#F7F7F7",
        textAlign: "center",
        color: "#999999",
        padding: "24px 50px",
        fontSize: "14px",
      }}
    >
      © {new Date().getFullYear()} PHÒNG MA TUÝ. All rights reserved.
    </Footer>
  );
}
