pipeline {
    agent any

    environment {
        VITE_API_GATEWAY_URL = "http://localhost:9192"
    }

    tools {
        nodejs 'NodeJS'   // must match Jenkins Tools name
        maven 'maven'
        jdk 'JAVA'        // use your configured JDK name
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'harshitha',
                    url: 'https://github.com/HarshaVardhan-Padmanabhuni/Banking-System-Frontend.git'
            }
        }

        // Create .env (FIXED for Windows)
        stage('Create Env File') {
            steps {
                dir('frontend') {
                    bat 'echo VITE_API_GATEWAY_URL=%VITE_API_GATEWAY_URL% > .env'
                }
            }
        }

        // Frontend install
        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        // Frontend build
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        // Backend build
        stage('Build Backend') {
            steps {
                dir('Backend') {
                    bat 'mvn clean install -DskipTests'
                }
            }
        }

        // Run Eureka
        stage('Start Eureka Server') {
            steps {
                dir('Backend\\eureka-server') {
                    bat 'start cmd /c mvn spring-boot:run'
                }
            }
        }

        // Run API Gateway
        stage('Start API Gateway') {
            steps {
                dir('Backend\\api-gateway') {
                    bat 'start cmd /c mvn spring-boot:run'
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
