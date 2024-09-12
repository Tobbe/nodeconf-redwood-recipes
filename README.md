To run this example application follow these steps:

1. Clone this repo
2. Run `yarn install`
3. `touch .env`
4. `yarn rw g secret`
5. Add your secret to the .env file: `SESSION_SECRET=your_secret`
6. `yarn rw prisma migrate dev -n initial`
7. `yarn rw prisma db seed` (this should happend automatically, but didn't for
   me for some reason)
8. `yarn rw dev`
