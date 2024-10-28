pipeline {
  environment {
    MY_GITLAB_CRED = credentials('ahsan-gitlab')
    GIT_CHECKOUT_URL_CONFIG="http://192.168.0.70/npd-dev/teepee-coder-web.git"
  }
  agent {
    node {
      label 'Jenkins-212'
    }
  }
  stages {
    stage('Git Checkout staging') {
          when {
            branch 'staging'
           }
         steps {
          git branch: 'staging',
             credentialsId: 'ahsan-gitlab',
             url: "$GIT_CHECKOUT_URL_CONFIG"
         }
       }
      stage('Copy Build Files in VM staging '){
        when {
            branch 'staging'
        }
        steps{
            script{
          sh ' ssh billy-240 mkdir -p /var/www/pb.teepee-coder-web.com/html/'
          sh ' ssh billy-240 mkdir -p /home/serveradmin/backup/teepee-coder-web/$(date +"%Y%m%d")_$BUILD_NUMBER/'
          sh ' ssh billy-240 mkdir -p /home/serveradmin/backup/teepee-coder-web/$(date +"%Y%m%d")_$BUILD_NUMBER/release/'
          sh ' scp build_staging.zip billy-240:/home/serveradmin/backup/teepee-coder-web/$(date +"%Y%m%d")_$BUILD_NUMBER/release/'
          sh ' ssh billy-240 unzip /home/serveradmin/backup/teepee-coder-web/$(date +"%Y%m%d")_$BUILD_NUMBER/release/build_staging.zip -d /home/serveradmin/backup/teepee-coder-web/$(date +"%Y%m%d")_$BUILD_NUMBER/release/'
          sh ' ssh billy-240 rm -rf /var/www/pb.teepee-coder-web.com/html/*'
          sh ' sleep 30'
          sh ' ssh billy-240 cp -r /home/serveradmin/backup/teepee-coder-web/$(date +"%Y%m%d")_$BUILD_NUMBER/release/build/* /var/www/pb.teepee-coder-web.com/html/'
           }
        }
      }
      stage('Git Checkout Main') {
        when {
          branch 'main'
        }
      steps {
        git branch: 'main',
            credentialsId: 'ahsan-gitlab',
            url: "$GIT_CHECKOUT_URL_CONFIG"
        }
      }
      stage('Copy Build Files in VM Main '){
        when {
            branch 'main'
        }
        steps{
            script{
          sh ' ssh billy-240 mkdir -p /var/www/pb.teepee-coder-web-production.com/html/'
          sh ' ssh billy-240 mkdir -p /home/serveradmin/backup/teepee-coder-web-production/$(date +"%Y%m%d")_$BUILD_NUMBER/'
          sh ' ssh billy-240 mkdir -p /home/serveradmin/backup/teepee-coder-web-production/$(date +"%Y%m%d")_$BUILD_NUMBER/release/'
          sh ' scp build_prod.zip billy-240:/home/serveradmin/backup/teepee-coder-web-production/$(date +"%Y%m%d")_$BUILD_NUMBER/release/'
          sh ' ssh billy-240 unzip /home/serveradmin/backup/teepee-coder-web-production/$(date +"%Y%m%d")_$BUILD_NUMBER/release/build_prod.zip -d /home/serveradmin/backup/teepee-coder-web-production/$(date +"%Y%m%d")_$BUILD_NUMBER/release/'
          sh ' ssh billy-240 rm -rf /var/www/pb.teepee-coder-web-production.com/html/*'
          sh ' sleep 30'
          sh ' ssh billy-240 cp -r /home/serveradmin/backup/teepee-coder-web-production/$(date +"%Y%m%d")_$BUILD_NUMBER/release/build/* /var/www/pb.teepee-coder-web-production.com/html/'
           }
        }
      }
}
post {
    always {
      emailext(subject: 'Jenkins Build $BUILD_STATUS : Job $PROJECT_NAME', body: '''Deployment to $BRANCH_NAME is $BUILD_STATUS
      Job Name : $PROJECT_NAME
      Build number : $BUILD_NUMBER
      More info at: $BUILD_URL''', to: 'ahsan.ali@planetbeyond.co.uk, ahmed@highersummit.com')
    }
  }
}
