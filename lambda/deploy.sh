echo 'zipping up code...'
rm index.zip
cd src
zip -q -r ../index.zip *
cd .. 
echo 'updating lambda...'
aws lambda update-function-code --function-name brain-lambda --zip-file fileb://index.zip
