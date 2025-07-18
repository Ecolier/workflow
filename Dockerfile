FROM denoland/deno:latest AS cache

WORKDIR /app
COPY . .
RUN deno cache main.ts

FROM denoland/deno:latest AS development

WORKDIR /app
COPY --from=cache /app .

EXPOSE 8000

ENTRYPOINT ["deno"]
CMD ["task", "dev"]

FROM denoland/deno:latest AS production

WORKDIR /app
COPY --from=cache /app .
ENTRYPOINT ["deno"]
CMD ["task", "serve"]