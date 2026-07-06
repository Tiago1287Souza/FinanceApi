import prismaClient from "../../prisma";

interface ReceiveRequest {
  item_id: string;
  user_id: string;
}

class DeleteReceiveService {
  async execute({ item_id, user_id }: ReceiveRequest) {
    // Buscar o receive
    const receive = await prismaClient.receive.findFirst({
      where: {
        id: item_id,
      },
    });

    if (!receive) {
      throw new Error("Receive not found");
    }

    // Buscar o usuário
    const findUser = await prismaClient.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!findUser) {
      throw new Error("User not found");
    }

    // Deletar o receive
    await prismaClient.receive.delete({
      where: {
        id: item_id,
      },
    });

    // Atualizar saldo do usuário
    const valueUpdated =
      receive.type === "despesa"
        ? findUser.balance - receive.value
        : findUser.balance + receive.value;

    await prismaClient.user.update({
      where: {
        id: user_id,
      },
      data: {
        balance: valueUpdated,
      },
    });

    return { status: "updated" };
  }
}

export { DeleteReceiveService };
