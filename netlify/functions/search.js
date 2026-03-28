exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Native Search enabled in App.js. Mocked search function retired." })
    };
};
