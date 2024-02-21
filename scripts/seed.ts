const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: "Protagonists" },
                { name: "Side Characters" },
                { name: "Antagonists" },
                { name: "Mentors" },
            ]
        })
    } catch (error) {
        console.log("Error seeding default categories", error)
    } finally {
        await db.$disconnect();
    }
}

main();