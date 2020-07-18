#!/bin/bash

npm install

cat <<EOF > .git/hooks/pre-commit  
npm test
if [ \$? != 0 ]; then 
    exit 1
fi
EOF

chmod +x .git/hooks/pre-commit  

cat <<EOF > .git/hooks/pre-push  
npx eslint ./*.js  
if [ \$? != 0 ]; then 
    exit 1
fi
EOF

chmod +x .git/hooks/pre-push
