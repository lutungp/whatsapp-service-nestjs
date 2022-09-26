export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    clientid : process.env.CLIENT_ID
});