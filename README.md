# WAMS-FE ROOT

This is a monorepo which merge multiple application into one repo to be able to share components and utils between them
using Turborepo.

## What's inside?

This monorepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `wams-gateway-fe`: Gateway Next.js app
- `wams-sysadmin-fe`: SysAdmin Next.js app

- `tsconfig`: `tsconfig.json`s used throughout the monorepo
- `template-share`: template shared components and elements from the Vuexy template used in the other Next.Js apps
- `ui`: UI shared components and elements (default).

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

*Info: if there is some changes made in the packages don't forget to run pnpm i

### Run Dev

To run all application in dev mode

```
turbo run dev
```

To run dev a specific app, run the following command:

```
turbo run dev --filter=workSpaceName
```

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To run dev all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Servers and links

- **Servername** | **Port** | **Link** -
- config.dev.prm.novobit.eu | 8088 | https://config.dev.prm.novobit.eu -
- eureka.dev.prm.novobit.eu | 8061 | https://eureka.dev.prm.novobit.eu -
- gateway.dev.prm.novobit.eu | 8060 | https://gateway.dev.prm.novobit.eu -
- sms.dev.prm.novobit.eu | 40400 | https://sms.dev.prm.novobit.eu -
- ims.dev.prm.novobit.eu | 40402 | https://ims.dev.prm.novobit.eu -
- kms.dev.prm.novobit.eu | 40403 | https://kms.dev.prm.novobit.eu -
- mms.dev.prm.novobit.eu | 40404 | https://mms.dev.prm.novobit.eu -
- dms.dev.prm.novobit.eu | 40405 | https://dms.dev.prm.novobit.eu -
- cms.dev.prm.novobit.eu | 40407 | https://cms.dev.prm.novobit.eu -
- hrm.dev.prm.novobit.eu | 40408 | https://hrm.dev.prm.novobit.eu -
- rpm.dev.prm.novobit.eu | 40409 | https://rpm.dev.prm.novobit.eu -
- lms.dev.prm.novobit.eu | 40410 | https://lms.dev.prm.novobit.eu -
- pms.dev.prm.novobit.eu | 40411 | https://pms.dev.prm.novobit.eu -
- quiz.dev.prm.novobit.eu | 40412 | https://quiz.dev.prm.novobit.eu -
- lnk.dev.prm.novobit.eu | 40413 | https://lnk.dev.prm.novobit.eu -
- fe-gateway.dev.prm.novobit.eu | 4000 | https://fe-gateway.dev.prm.novobit.eu -
- fe-sysadmin.dev.prm.novobit.eu | 4001 | https://fe-sysadmin.dev.prm.novobit.eu -
- fe-recruitment.dev.prm.novobit.eu | 4002 | https://fe-recruitment.dev.prm.novobit.eu -
- fe-calendar.dev.prm.novobit.eu | 4003 | https://fe-calendar.dev.prm.novobit.eu -
- fe-candidate.dev.prm.novobit.eu | 4004 | https://fe-candidate.dev.prm.novobit.eu -
- fe-quiz.dev.prm.novobit.eu | 4005 | https://fe-quiz.dev.prm.novobit.eu -
- fe-quiz.dev.hrm.novobit.eu | 4006 | https://fe-hrm.dev.prm.novobit.eu -
- fe-document.dev.prm.novobit.eu | 4007 | https://fe-document.dev.prm.novobit.eu -
- dev.smartcode.novobit.eu | 4008 | https://dev.smartcode.novobit.eu -
- qa.smartcode.novobit.eu | 4009 | https://qa.smartcode.novobit.eu -
- fe-visio.dev.prm.novobit.eu | 4010 | https://fe-visio.dev.prm.novobit.eu -
- fe-lnk.dev.prm.novobit.eu | 4011 | https://fe-lnk.dev.prm.novobit.eu -
- fe-lms.dev.prm.novobit.eu | 4012 | https://fe-lms.dev.prm.novobit.eu -
- fe-minio.dev.prm.novobit.eu | 9001 | https://fe-minio.dev.prm.novobit.eu -

