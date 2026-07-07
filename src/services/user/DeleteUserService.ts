import prismaClient from "../../prisma";

class DeleteUserService {
  async execute(user_id: string) {
    // Exclui todos os registros do usuário
    await prismaClient.receive.deleteMany({
      where: {
        user_id: user_id,
      },
    });

    // Exclui o usuário
    await prismaClient.user.delete({
      where: {
        id: user_id,
      },
    });

    return {
      message: "Usuário excluído com sucesso.",
    };
  }
}

export { DeleteUserService };
