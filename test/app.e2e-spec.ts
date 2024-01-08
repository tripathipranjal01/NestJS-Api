import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import {
  CreatebookmarksDto,
  EditbookmarksDto,
} from '../src/bookmarks/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditusersDto } from '../src/users/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'vlad@gmail.com',
      password: '123',
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('usersAt', 'access_token');
      });
    });
  });

  describe('users', () => {
    describe('Get me', () => {
      it('should get current users', () => {
        return pactum
          .spec()
          .get('/userss/me')
          .withHeaders({
            Authorization: 'Bearer $S{usersAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit users', () => {
      it('should edit users', () => {
        const dto: EditusersDto = {
          firstName: 'Vladimir',
          email: 'vlad@codewithvlad.com',
        };
        return pactum
          .spec()
          .patch('/userss')
          .withHeaders({
            Authorization: 'Bearer $S{usersAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('bookmarkss', () => {
    describe('Get empty bookmarkss', () => {
      it('should get bookmarkss', () => {
        return pactum
          .spec()
          .get('/bookmarkss')
          .withHeaders({
            Authorization: 'Bearer $S{usersAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmarks', () => {
      const dto: CreatebookmarksDto = {
        title: 'First bookmarks',
        link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
      };
      it('should create bookmarks', () => {
        return pactum
          .spec()
          .post('/bookmarkss')
          .withHeaders({
            Authorization: 'Bearer $S{usersAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarksId', 'id');
      });
    });

    describe('Get bookmarkss', () => {
      it('should get bookmarkss', () => {
        return pactum
          .spec()
          .get('/bookmarkss')
          .withHeaders({
            Authorization: 'Bearer $S{usersAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmarks by id', () => {
      it('should get bookmarks by id', () => {
        return pactum
          .spec()
          .get('/bookmarkss/{id}')
          .withPathParams('id', '$S{bookmarksId}')
          .withHeaders({
            Authorization: 'Bearer $S{usersAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarksId}');
      });
    });

    describe('Edit bookmarks by id', () => {
      const dto: EditbookmarksDto = {
        title:
          'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
        description:
          'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
      };
      it('should edit bookmarks', () => {
        return pactum
          .spec()
          .patch('/bookmarkss/{id}')
          .withPathParams('id', '$S{bookmarksId}')
          .withHeaders({
            Authorization: 'Bearer $S{usersAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete bookmarks by id', () => {
      it('should delete bookmarks', () => {
        return pactum
          .spec()
          .delete('/bookmarkss/{id}')
          .withPathParams('id', '$S{bookmarksId}')
          .withHeaders({
            Authorization: 'Bearer $S{usersAt}',
          })
          .expectStatus(204);
      });

      it('should get empty bookmarkss', () => {
        return pactum
          .spec()
          .get('/bookmarkss')
          .withHeaders({
            Authorization: 'Bearer $S{usersAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
