import React, { useEffect } from "react";

const UnidadMedida: React.FC = () => {
  useEffect(() => {
    console.log("La página de UnidadMedida se ha cargado");
  }, []);

  return (
    <div>
      <h1>Unidad de Medida</h1>
    </div>
  );
};

export default UnidadMedida;
