import { useRouteError, ErrorResponse } from "react-router-dom";
import { Result, Button } from "antd";

const ErrorPage = () => {
  const error = useRouteError() as ErrorResponse;
  let errorMessage = "Ocurrió un error inesperado.";

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle="Lo sentimos, la página que estás buscando no existe."
      extra={
        <Button type="primary" href="/">
          Volver al Inicio
        </Button>
      }
    />
  );
};

export default ErrorPage;
