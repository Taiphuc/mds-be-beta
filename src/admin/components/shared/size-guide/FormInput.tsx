import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { XMarkMini } from "@medusajs/icons";
import { Button, Input, Label, Switch, Tabs } from "@medusajs/ui";

export default function FormInput({
  data,
  setData,
  setDefaultSize,
  handleOpenPickProducts,
  handleRemoveSelectedProduct,
  selectedProducts,
  selectedCollections,
  handleOpenPickCollections,
  handleRemoveSelectedCollection,
  handleOpenPickTags,
  selectedTags,
  handleRemoveSelectedTag,
}) {
  return (
    <div className="w-full flex flex-wrap h-full">
      <div className="flex w-1/2 flex-wrap pt-3">
        <Tabs defaultValue="1" className="w-full">
          <Tabs.List>
            <Tabs.Trigger value="1">Content</Tabs.Trigger>
            <Tabs.Trigger value="2">Product</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="1" className="h-[600px] overflow-y-auto">
            <div className="w-full flex p-3 flex-col gap-y-2">
              <Label htmlFor="name" className="text-ui-fg-subtle">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Name of size guide"
                value={data?.name}
                onChange={(e) => {
                  setData({ ...data, name: e.target.value });
                }}
              />
            </div>

            <div className="w-full lex p-3 flex-col gap-y-2">
              <Label htmlFor="topText" className="text-ui-fg-subtle">
                Top text
              </Label>
              <CKEditor
                editor={ClassicEditor}
                data={data?.topText}
                onChange={(event, editor) => {
                  setData({ ...data, topText: editor.data.get() });
                }}
              />
            </div>

            <div className="w-full lex p-3 flex-col gap-y-2">
              <Label htmlFor="content" className="text-ui-fg-subtle">
                Size guide table
              </Label>
              <CKEditor
                editor={ClassicEditor}
                data={data?.content}
                onChange={(event, editor) => {
                  setData({ ...data, content: editor.getData() });
                }}
              />
            </div>

            <div className="w-full lex p-3 flex-col gap-y-2">
              <Label htmlFor="content" className="text-ui-fg-subtle">
                Bottom text
              </Label>
              <CKEditor
                editor={ClassicEditor}
                data={data?.bottomText}
                onChange={(event, editor) => {
                  setData({ ...data, bottomText: editor.getData() });
                }}
              />
            </div>
          </Tabs.Content>
          <Tabs.Content
            value="2"
            className="w-full flex flex-col space-y-3 py-3"
          >
            <div className="w-full flex flex-col space-y-2">
              <p>Default to all products: </p>
              <div className="flex items-center gap-x-2">
                <Switch
                  id="set-default"
                  onCheckedChange={(e) => {
                    setDefaultSize(e);
                  }}
                />
                <Label htmlFor="set-default">On off default size guide</Label>
              </div>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <p>Show on these Products</p>
              <Button variant="secondary" onClick={handleOpenPickProducts}>
                Pick Products
              </Button>
              <div className="w-full flex flex-wrap gap-2">
                {selectedProducts?.map((product) => {
                  return (
                    <div
                      className="border p-1 space-x-2 flex items-center bg-indigo-5 text-indigo-60"
                      key={product?.id}
                    >
                      <div> {product?.title}</div>
                      <div>
                        <XMarkMini
                          className="cursor-pointer"
                          onClick={() => {
                            handleRemoveSelectedProduct(product);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <p>OR show on Products within these Collections</p>
              <Button variant="secondary" onClick={handleOpenPickCollections}>
                Pick Collections
              </Button>
              <div className="w-full flex flex-wrap gap-2">
                {selectedCollections?.map((collection) => {
                  return (
                    <div
                      className="border p-1 space-x-2 flex items-center bg-indigo-5 text-indigo-60"
                      key={collection?.id}
                    >
                      <div> {collection?.title}</div>
                      <div>
                        <XMarkMini
                          className="cursor-pointer"
                          onClick={() => {
                            handleRemoveSelectedCollection(collection);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <p>OR show on Products that are tagged with:</p>
              <Button variant="secondary" onClick={handleOpenPickTags}>
                Pick Tags
              </Button>
              <div className="w-full flex flex-wrap gap-2">
                {selectedTags?.map((tag) => {
                  return (
                    <div
                      className="border p-1 space-x-2 flex items-center bg-indigo-5 text-indigo-60"
                      key={tag?.id}
                    >
                      <div> {tag?.value}</div>
                      <div>
                        <XMarkMini
                          className="cursor-pointer"
                          onClick={() => {
                            handleRemoveSelectedTag(tag);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Tabs.Content>
        </Tabs>
      </div>
      <div className="flex w-1/2 h-[700px] overflow-y-auto flex-wrap items-start">
        <div
          className="w-full p-3"
          dangerouslySetInnerHTML={{ __html: data?.topText }}
        ></div>
        <div
          className="w-full p-3 table-size"
          dangerouslySetInnerHTML={{ __html: data?.content }}
        ></div>
        <div
          className="w-full p-3"
          dangerouslySetInnerHTML={{ __html: data?.bottomText }}
        ></div>
      </div>
    </div>
  );
}
