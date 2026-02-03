FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build-time variables for Next.js (NEXT_PUBLIC_* are inlined at build time)
ARG NEXT_PUBLIC_API_URL=https://api.6284765-xq71389.twc1.net
ARG NEXT_PUBLIC_SITE_URL=https://mezhinsky.me
ARG NEXT_PUBLIC_GA_ID=G-RTN0S38VT8
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]