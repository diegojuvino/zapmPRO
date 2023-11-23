import Invoices from "../../models/Invoices";
import Company from "../../models/Company";

interface Request {
  companyId: number;
}

const FindAllPlanService = async (companyId: number): Promise<any[]> => {
  try {
    const invoices = await Invoices.findAll({
      order: [["id", "ASC"]]
    });

    const companyIdList = invoices.map((invoice) => invoice.companyId);

    const companies = await Company.findAll({
      where: {
        id: companyIdList
      }
    });

    const result = invoices.map((invoice) => {
      const company = companies.find((c) => c.id === invoice.companyId);
      return {
        companyId: invoice.companyId,
        createdAt: invoice.createdAt,
        companyName: company ? company.name : "Empresa não encontrada",
        dueDate: invoice.dueDate,
        id: invoice.id,
        status: invoice.status,
        updatedAt: invoice.updatedAt,
        value: invoice.value,
      };
    });

    return result;
  } catch (error) {
    throw new Error("Erro ao buscar faturas: " + error.message);
  }
};

export default FindAllPlanService;
