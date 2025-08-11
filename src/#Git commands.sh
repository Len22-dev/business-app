#Git commands
git remote #check the remote repository
git remote remove origin #remove the remote repository
git remote add origin https://github.com/username/repo.git #add remote repository
git push -u origin master #push the code to the remote repository
git pull #pull the code from the remote repository
git clone https://github.com/username/repo.git #clone the repository
git branch #list the branches
git checkout branch_name #switch to the branch
git merge branch_name #merge the branch into the current branch
git log #view the commit history
git status #view the status of the repository
git add . #add all the files to the staging area
git commit -m "commit message" #commit the changes
git push #push the changes to the remote repository
git reset --hard HEAD~1 #reset the changes
git config user.name #check the user name
git config user.email #check the user email
git config --list #list all the git config
git config --global user.name "username" #set the user name
git config --global user.email "email" #set the user email
git config --global --unset user.name #unset the user name
git config --global --unset user.email #unset the user email
git credential-manager list #check github account authentication
git credential-manager delete #delete github account authentication
# Set new username
git config --global user.name "Your Name"

# Set new email
git config --global user.email "your.email@example.com"

#Docker commands
docker build -t image_name . #build the image
docker run -p 8080:8080 image_name #run the image
docker images #list the images
docker ps #list the running containers
docker stop container_id #stop the container
docker rm container_id #remove the container
docker rmi image_id #remove the image
docker exec -it container_id /bin/bash #enter the container