import prismaClient from "../../prisma";

interface UserRequest {
  user_id: string;
  date: string;
}

interface ItemProp {
  id: string;
  description: string;
  value: number;
  type: string;
  date: string;
  user_id: string;
}

class ListUserBalanceService {
  async execute({ user_id, date }: UserRequest) {
    if (!user_id) {
      throw new Error("Invalid user");
    }

    const findUser = await prismaClient.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!findUser) {
      throw new Error("User not found");
    }

    const findReceive = await prismaClient.receive.findMany({
      where: {
        date: date,
        user_id: user_id,
        type: "receita",
      },
    });

    const findExpenses = await prismaClient.receive.findMany({
      where: {
        date: date,
        user_id: user_id,
        type: "despesa",
      },
    });

    function getSoma(total: number, item: ItemProp) {
      return total + item.value;
    }

    const resultRevenue = findReceive.reduce(getSoma, 0);
    const resultExpenses = findExpenses.reduce(getSoma, 0);

    const dashboard = [];

    dashboard.push(
      {
        tag: "saldo",
        saldo: findUser.balance,
      },
      {
        tag: "receita",
        saldo: resultRevenue,
      },
      {
        tag: "despesa",
        saldo: resultExpenses,
      }
    );

    return dashboard;
  }
}

export { ListUserBalanceService };
