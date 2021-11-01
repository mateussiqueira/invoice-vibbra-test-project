import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { SimpleModal } from "../../../../components/modals";
import { IState } from "../../../../store";
import { actionStoreInvoiceRequest } from "../../../../store/modules/invoices/actions";
import { IInvoice } from "../../../../store/modules/invoices/types";
import { actionSetCloseModalRequest } from "../../../../store/modules/modals/actions";
import { IModalsState } from "../../../../store/modules/modals/types";
import { months } from "../../../../utils";
import { addMoneyMask, removeMask } from "../../../../utils/masks";
import { modals } from "../../../../utils/modals";
import { ModalContent } from "./styles";

type InvoiceDataState = Omit<IInvoice, "valueUnmasked" | "id">;

const ModalRegisterInvoice: React.FC = () => {
  const dispatch = useDispatch();

  const [invoiceData, setInvoiceData] = useState<InvoiceDataState>({
    value: "",
    description: "",
    month: months[0].shortName,
    dateReceived: new Date(),
  });

  const { data: modalOpened } = useSelector<IState, IModalsState>(
    (state) => state.modals
  );

  const handleRegisterInvoice = useCallback(() => {
    const data: IInvoice = {
      dateReceived: invoiceData.dateReceived,
      month: invoiceData.month,
      value: invoiceData.value,
      valueUnmasked: removeMask(invoiceData.value) * 100,
      description: invoiceData.description,
      id: v4(),
    };

    const { dateReceived, description, month, value } = data;

    if (!dateReceived || !description || !month || !Number(removeMask(value))) {
      return toast.error("Ops... Digite corretamente os valores");
    }

    dispatch(actionStoreInvoiceRequest(data));
    dispatch(actionSetCloseModalRequest());

    toast.success("Nota lançada com sucesso!");

    setInvoiceData({
      dateReceived: new Date(),
      value: "",
      month: months[0].shortName,
      description: "",
    });
  }, [invoiceData, dispatch]);

  function handleCancelRegisterInvoice() {
    dispatch(actionSetCloseModalRequest());
  }

  return (
    <SimpleModal
      isOpen={modalOpened === modals.companyFound}
      buttonOkText="Cadastrar Nota"
      onClickButtonOk={handleRegisterInvoice}
      headerText="Cadastrar Nota"
      onClickButtonCancel={handleCancelRegisterInvoice}
    >
      <ModalContent>
        <label htmlFor="input-value-invoice">
          Valor da Nota
          <input
            placeholder="Valor da nota"
            value={invoiceData.value}
            onChange={({ target }) => {
              setInvoiceData({
                ...invoiceData,
                value: addMoneyMask(target.value),
              });
            }}
          />
        </label>

        <label htmlFor="input-description-invoice">
          Descrição do serviço
          <input
            placeholder="Descrição do serviço"
            value={invoiceData.description}
            onChange={(event) => {
              setInvoiceData({
                ...invoiceData,
                description: event.target.value,
              });
            }}
          />
        </label>

        <label htmlFor="input-date-invoice">
          Data do recebimento
          <input
            type="date"
            placeholder="Data de recebimento"
            value={
              new Date(invoiceData.dateReceived).toISOString().split("T")[0]
            }
            onChange={({ target }) => {
              setInvoiceData({
                ...invoiceData,
                dateReceived: new Date(target.value),
              });
            }}
          />
        </label>

        <label htmlFor="input-month-invoice">
          Mês de competência
          <select
            defaultValue={months[0].shortName}
            value={invoiceData.month}
            onChange={(event) => {
              console.log(event.target.value);
              setInvoiceData({
                ...invoiceData,
                month: event.target.value,
              });
            }}
          >
            <option disabled>Mês de Competência</option>
            {months.map((month) => (
              <option value={month.shortName}>{month.fullName}</option>
            ))}
          </select>
        </label>
      </ModalContent>
    </SimpleModal>
  );
};

export default ModalRegisterInvoice;
