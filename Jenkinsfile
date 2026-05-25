pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'harshitha',
                url: 'https://github.com/HarshaVardhan-Padmanabhuni/Banking-System-Frontend.git'
            }
        }

        stage('Install Frontend') {
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

        stage('Build Backend') {
            steps {
                dir('Backend') {
                    sh 'mvn clean install -DskipTests'
                }
            }
        }

    }
}
