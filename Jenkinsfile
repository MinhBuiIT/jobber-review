
namespace = "production"
serviceName = "jobber-review"
service = "Jobber Review"

pipeline {
  agent {
    label 'Jenkin-Agent'
  }

  tools {
    nodejs "NodeJS"
    dockerTool "Docker"
  }

  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub')
    IMAGE_NAME = "minhbuidev" + "/" + "jobber-review"
    IMAGE_TAG = "stable:${BUILD_NUMBER}"
  }

  stages {
    stage("Cleanup Workspace") {
      steps {
        cleanWs()
      }
    }

    stage("Prepare Environment") {
      steps {
        git branch: 'main', credentialsId: 'github', url: 'https://github.com/MinhBuiIT/jobber-review'
        sh 'npm install'
      }
    }

    stage("Lint check") {
      steps {
        sh 'lint:check'
      }
    }

    stage("Format check") {
      steps {
        sh 'prettier:check'
      }
    }

    stage("Run Unit Tests") {
      steps {
        sh 'npm run test'
      }
    }

    stage("Build and Push") {
      steps {
        sh 'docker login -u $DOCKERHUB_CREDENTIALS_USR --password $DOCKERHUB_CREDENTIALS_PSW'
        sh 'docker build -t $IMAGE_NAME .'
        sh 'docker tag $IMAGE_NAME $IMAGE_NAME:$IMAGE_TAG'
        sh 'docker tag $IMAGE_NAME $IMAGE_NAME:stable'
        sh 'docker push $IMAGE_NAME:$IMAGE_TAG'
        sh 'docker push $IMAGE_NAME:stable'
      }
    }
// Bước này sẽ cleanup các image đã build để tránh chiếm dụng dung lượng ổ đĩa của Jenkins server
    stage("Cleanup Artifact") {
      steps {
        sh 'docker rmi $IMAGE_NAME:$IMAGE_TAG || true'
        sh 'docker rmi $IMAGE_NAME:stable || true'
      }
    }
  }
}
