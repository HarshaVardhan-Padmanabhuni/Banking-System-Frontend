pipeline {
    agent any

    environment {
        // You can change this later to server IP
        VITE_API_GATEWAY_URL = "http://localhost:9192"
    }

    tools {
        nodejs 'NodeJS'     // Configure this in Jenkins tools
        maven 'Maven'      // Configure this in Jenkins tools
        jdk 'JDK17'        // Configure this also
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'harshitha',
                url: 'https://github.com/HarshaVardhan-Padmanabhuni/Banking-System-Frontend.git'
            }
        }

        // Create .env dynamically
        stage('Create Env File') {
            steps {
                dir('frontend') {
                    sh '''
                    echo "VITE_API_GATEWAY_URL=${VITE_API_GATEWAY_URL}" > .env
                    '''
                }
            }
        }

        // Frontend build
        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        // Backend build (all microservices)
        stage('Build Backend') {
            steps {
                dir('Backend') {
                    sh 'mvn clean install -DskipTests'
                }
            }
        }

        //Run services in order(optional)
        stage('Start Eureka Server') {
            steps {
                dir('Backend/eureka-server') {
                    sh 'nohup mvn spring-boot:run > eureka.log 2>&1 &'
                }
            }
        }

        stage('Start API Gateway') {
            steps {
                dir('Backend/api-gateway') {
                    sh 'nohup mvn spring-boot:run > gateway.log 2>&1 &'
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
