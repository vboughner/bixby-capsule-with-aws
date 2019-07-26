echo 'zipping up code...'
rm -f index.zip
zip -q -r index.zip *
echo 'updating lambda...'
aws lambda update-function-code --function-name memory-lambda --zip-file fileb://index.zip
