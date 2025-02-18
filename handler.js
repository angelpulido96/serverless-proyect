const AWS = require("aws-sdk");
const stepfunctions = new AWS.StepFunctions();

module.exports.startStateMachine = async (event) => {
  try {
    const params = {
      stateMachineArn: "arn:aws:states:us-east-1:243497028053:stateMachine:MyStateMachineStepFunctionsStateMachine-NuGE1KMxsLaZ",
      input: JSON.stringify({ message: "Ejecución desde API Gateway" }),
    };

    const execution = await stepfunctions.startExecution(params).promise();
    console.log("Step Function iniciada:", execution);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Step Function iniciada correctamente",
        executionArn: execution.executionArn,
      }),
    };
  } catch (error) {
    console.error("Error al iniciar Step Function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al iniciar la Step Function" }),
    };
  }
};

module.exports.getExecutionStatus = async (event) => {
  const executionArn = event?.queryStringParameters?.executionArn;

  if (!executionArn) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "executionArn is required" }),
    };
  }

  try {
    const result = await stepfunctions.describeExecution({ executionArn }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        executionArn: result.executionArn,
        status: result.status,
        startDate: result.startDate,
        stopDate: result.stopDate,
        output: result.output ? JSON.parse(result.output) : null,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports.firstFunction = async (event) => {
  console.log("Ejecutando Primera Función");
  return { message: "Paso 1 completado", next: "secondFunction" };
};

module.exports.secondFunction = async (event) => {
  console.log("Ejecutando Segunda Función");
  return { message: "Paso 2 completado" };
};


module.exports.registerUser = async (event) => {
  try {
    console.log("🚀 ~ event:", event);
    const data = JSON.parse(event.body);

    if (!data?.name || !data?.email || !data?.password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan datos requeridos" }),
      };
    }

    // Simula el registro del usuario
    const userId = `user-${Date.now()}`;
    console.log(`Usuario registrado: ${userId}`);

    // Iniciar la Step Function después del registro exitoso
    const params = {
      stateMachineArn: "arn:aws:states:us-east-1:243497028053:stateMachine:UserRegistrationFlowStepFunctionsStateMachine-MbEDlFAqMTe0", // ARN de la Step Function
      input: JSON.stringify({ userId, name: data.name, email: data.email }),
    };

    const execution = await stepfunctions.startExecution(params).promise();
    console.log("Step Function iniciada:", execution);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Usuario registrado con éxito",
        userId,
        executionArn: execution.executionArn, // Devuelve el ARN de ejecución
      }),
    };
  } catch (error) {
    console.error("Error en registerUser:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno del servidor" }),
    };
  }
};


module.exports.primeraDespuesDelRegistro = async (event) => {
  console.log("Ejecutando Primera Función después del registro", event);
  return { message: "Primer paso después del registro completado" };
};

module.exports.segundaDespuesDelRegistro = async (event) => {
  console.log("Ejecutando Segunda Función después del registro", event);
  return { message: "Segundo paso después del registro completado" };
};

