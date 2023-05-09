FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

#env from arguments
ENV PORT=3333

ENV DB_HOST=rds-medon.cvmnsx0346ox.us-east-1.rds.amazonaws.com
ENV DB_PORT=3306
ENV DB_USERNAME=admin
ENV DB_PASSWORD=QwerTy1234!
ENV DB_NAME=medon_db

ENV BASE_FRONT_URL=https://medon.fun

ENV SMTP_LOGIN=jurchenko.a@gmail.com
ENV SMTP_PASS=sfHXGMTUjxZ7PObc
ENV SMTP_SERVER=smtp-relay.sendinblue.com
ENV EMAIL_SENDER=admin@medon.com

ENV JWT_SECRET=my_secret_auth
ENV JWT_EXPIRATION_TIME=6h

ENV GOOGLE_CLIENT_ID=790559126715-933s8ngov6rqllmsssp6jj6co9sqe9s2.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENV GOOGLE_CALLBACK_URL=https://medon.online/auth/google/redirect

EXPOSE 3306
EXPOSE 3333
CMD [ "node", "dist/main.js" ]