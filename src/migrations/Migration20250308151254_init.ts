import { Migration } from '@mikro-orm/migrations';

export class Migration20250308151254_init extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" uuid not null, "email" varchar(255) not null, "display_name" varchar(255) not null, "hashed_password" varchar(255) not null, "profile_image" varchar(255) null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);

    this.addSql(`create table "posts" ("id" uuid not null, "title" text not null, "content" text not null, "posted_at" timestamptz null, "edited_at" timestamptz null, "author_id" uuid not null, constraint "posts_pkey" primary key ("id"));`);

    this.addSql(`create table "votes" ("id" uuid not null, "type" text check ("type" in ('upvote', 'downvote')) not null, "user_id" uuid not null, "post_id" uuid not null, "created_at" timestamptz null, "updated_at" timestamptz null, constraint "votes_pkey" primary key ("id"));`);
    this.addSql(`alter table "votes" add constraint "votes_user_id_post_id_unique" unique ("user_id", "post_id");`);

    this.addSql(`alter table "posts" add constraint "posts_author_id_foreign" foreign key ("author_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "votes" add constraint "votes_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "votes" add constraint "votes_post_id_foreign" foreign key ("post_id") references "posts" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "posts" drop constraint "posts_author_id_foreign";`);

    this.addSql(`alter table "votes" drop constraint "votes_user_id_foreign";`);

    this.addSql(`alter table "votes" drop constraint "votes_post_id_foreign";`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "posts" cascade;`);

    this.addSql(`drop table if exists "votes" cascade;`);
  }

}
