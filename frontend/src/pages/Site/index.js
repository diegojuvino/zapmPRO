import React, { useState, useEffect } from "react";

function SiteEmbed() {
  return (
    <div>
      <iframe
        title="WhatsPS"
        width="100%" // Largura desejada
        height="800" // Altura desejada
        src="https://whatsps.com.br/home-app/"
        frameBorder="0"
      ></iframe>
    </div>
  );
}

export default SiteEmbed;