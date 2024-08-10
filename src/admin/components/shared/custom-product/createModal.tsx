import { Button, FocusModal } from "@medusajs/ui";
import { FC, useState } from "react";
import Design1Provider from "./design/Provider";
import { useDesign1 } from "./design/useDesign";
import CreateCustomProductBase from "./design/test1";
type CreateModalProps = {
  open: boolean,
  onOpenChange: (data: boolean) => void
  notify: any
}
const CreateModal: FC<CreateModalProps> = ({ open, onOpenChange, notify }) => {
  const [isSave, setIsSave] = useState(false)
  const handleSave = () => {
    setIsSave(true);
  }

  return (
    <Design1Provider>
      <FocusModal open={open} onOpenChange={onOpenChange}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button onClick={handleSave} >Save</Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-4">
              <CreateCustomProductBase isSave={isSave} setIsSave={setIsSave} notify={notify} />
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </Design1Provider>
  )
}
export default CreateModal