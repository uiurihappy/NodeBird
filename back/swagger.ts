import * as index from "./index";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Nodebird with Swagger!",
      version: "0.0.1",
      description: "A REST API using swagger and express.",
    },
    servers: [
      {
        url: `https://localhost:3065`,
      },
    ],
  },
  apis: [],
};

export default options;
