import React from "react";

export default function Footer() {
  return (
    <>
      <style>
        {`
          .custom-footer {
            width: 100%;
          }

          @media (min-width: 1660px) {
            .custom-footer {
              width: 1660px; 
            }
          }
        `}
      </style>
      <div
        className="custom-footer"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          bottom: "0",
          right: "0",
          padding: "15px",
          zIndex: "1001",
          // height: "50px",
          backgroundColor: "#ffffff",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        }}>
        <div>{new Date().getFullYear()} Orjin</div>
        <div>
          <div>Design & Develop by Orjin Team</div>
        </div>
      </div>
    </>
  );
}
