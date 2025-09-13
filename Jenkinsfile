
namespace = "production"
serviceName = "jobber-review"
service = "Jobber Review"

def groovyMethods
def m1 = System.currentTimeMillis()

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
    IMAGE_TAG = "stable-${BUILD_NUMBER}"
    NPM_TOKEN = credentials('github-npm-token')
  }

  stages {
    stage("Cleanup Workspace") {
      steps {
        cleanWs()
      }
    }

    stage("Checkout Code") {
      steps {
        sh "[ -d pipeline ] || mkdir pipeline"
        dir("pipeline") {
          git branch: 'main', credentialsId: 'github', url: 'https://github.com/MinhBuiIT/jenkin-automation'
          script {
            groovyMethods = load('functions.groovy')
          }
        }

        git branch: 'main', credentialsId: 'github', url: 'https://github.com/MinhBuiIT/jobber-review'
      }
    }

    stage("Setup NPM Config") {
      steps {
        // ✅ Copy .npmrc để access private packages
        sh '''
          echo "Creating .npmrc for private GitHub packages..."
          cat > ~/.npmrc << EOF
          @minhbuiit:registry=https://npm.pkg.github.com
          //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
          registry=https://registry.npmjs.org/
          EOF
          echo "NPM config created successfully"
          cat ~/.npmrc
        '''
      }
    }

    stage("Prepare Environment") {
      steps {
        sh 'npm install'
      }
    }

    // stage("Lint check") {
    //   steps {
    //     sh 'lint:check'
    //   }
    // }

    // stage("Format check") {
    //   steps {
    //     sh 'prettier:check'
    //   }
    // }

    stage("Run Unit Tests") {
      steps {
        sh 'npm run test'
      }
    }

    stage("Setup NPM Config Again") {
      steps {
        // ✅ Copy .npmrc để access private packages
        sh '''
          echo "Preparing files for Docker build..."
          cp ~/.npmrc ./
        '''
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
  post {
    success {
      script {
        def m2 = System.currentTimeMillis()
        def duration = groovyMethods.durationTime(m1, m2)
        def author = groovyMethods.readCommitAuthor()
        groovyMethods.notifySlack("","jobber-log",[
        				[
        					title: "BUILD SUCCEEDED: ${service} Service with build number ${env.BUILD_NUMBER}",
        					title_link: "${env.BUILD_URL}",
        					color: "good",
        					text: "Created by: ${author}",
        					"mrkdwn_in": ["fields"],
        					fields: [
        						[
        							title: "Duration Time",
        							value: "${duration}",
        							short: true
        						],
        						[
        							title: "Stage Name",
        							value: "Production",
        							short: true
        						],
        					]
        				]
        		]
        )
      }
    }
    failure {
      script {
        def m2 = System.currentTimeMillis()
        def duration = groovyMethods.durationTime(m1, m2)
        def author = groovyMethods.readCommitAuthor()
        groovyMethods.notifySlack("","jobber-log",[
        				[
        					title: "BUILD FAILED: ${service} Service with build number ${env.BUILD_NUMBER}",
        					title_link: "${env.BUILD_URL}",
        					color: "error",
        					text: "Created by: ${author}",
        					"mrkdwn_in": ["fields"],
        					fields: [
        						[
        							title: "Duration Time",
        							value: "${duration}",
        							short: true
        						],
        						[
        							title: "Stage Name",
        							value: "Production",
        							short: true
        						],
        					]
        				]
        		]
        )
      }
    }
  }
}
