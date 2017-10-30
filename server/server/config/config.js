module.exports = {
    development:{
        database: "dispatch",
        username: process.env.DEV_USERNAME,
        password: process.env.DEV_PASSWORD,
        host: process.env.DEV_HOST,
        port: process.env.DEV_PORT,
        dialect:"postgres"
    },
    test:{
        database: "dispatch",
        username: process.env.TEST_USERNAME,
        password: process.env.TEST_PASSWORD,
        host: process.env.TEST_HOST,
        port: process.env.TEST_PORT,
        dialect:"postgres"
    }
}