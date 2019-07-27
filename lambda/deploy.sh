echo 'zipping up code...'
rm -f lambda-index-file.zip
zip -q -r lambda-index-file.zip *
echo 'updating lambda...'
aws lambda update-function-code --function-name memory-lambda --zip-file fileb://lambda-index-file.zip
rm -f lambda-index-file.zip
