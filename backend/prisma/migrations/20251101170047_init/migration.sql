-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "public_key" TEXT,
    "private_key_encrypted" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "researches" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ipfs_hash" TEXT NOT NULL,
    "encrypted_key" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT[],
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "researches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_grants" (
    "id" TEXT NOT NULL,
    "research_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "decryption_key" TEXT NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "access_grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "research_id" TEXT NOT NULL,
    "tx_type" TEXT NOT NULL,
    "tx_hash" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "researches_author_id_idx" ON "researches"("author_id");

-- CreateIndex
CREATE INDEX "researches_ipfs_hash_idx" ON "researches"("ipfs_hash");

-- CreateIndex
CREATE INDEX "access_grants_user_id_idx" ON "access_grants"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "access_grants_research_id_user_id_key" ON "access_grants"("research_id", "user_id");

-- CreateIndex
CREATE INDEX "transactions_research_id_idx" ON "transactions"("research_id");

-- AddForeignKey
ALTER TABLE "researches" ADD CONSTRAINT "researches_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_grants" ADD CONSTRAINT "access_grants_research_id_fkey" FOREIGN KEY ("research_id") REFERENCES "researches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_grants" ADD CONSTRAINT "access_grants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_research_id_fkey" FOREIGN KEY ("research_id") REFERENCES "researches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
