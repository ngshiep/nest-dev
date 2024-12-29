echo "What's version of the image you want to push?" 
read NEXT_VERSION 
docker build -t sl-basic .

docker tag sl-basic hiepnguyen995/sl-basic:v${NEXT_VERSION}
docker push hiepnguyen995/sl-basic:v${NEXT_VERSION}

echo "Đã build và push version v${NEXT_VERSION} thành công."