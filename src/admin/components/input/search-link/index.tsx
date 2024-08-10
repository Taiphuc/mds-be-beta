import { FC, useState, useMemo, useEffect, useRef, ChangeEvent } from "react";
import InputField from "..";
import { Container } from "../../shared/container";
import { useAdminCustomQuery } from "medusa-react";
import { BuildingStorefront, DocumentSeries, DocumentText, SwatchSolid, Tag } from "@medusajs/icons";
type SearchLinkProps = {
  onClick: (e: string, data: any) => void;
  defaultValue: string;
  data: any;
};

type subListDataType = {
  handle: string;
  title: string;
};

const SearchLink: FC<SearchLinkProps> = ({ onClick, defaultValue, data }) => {
  const [value, setValue] = useState(defaultValue || "");
  const [subListData, setSubListData] = useState<subListDataType[]>([]);
  const [showList, setShowList] = useState(false);
  const [showSubList, setShowSubList] = useState(false);
  const [query, setQuery] = useState({ type: "collection", title: "" });
  const timerRef = useRef(null);
  const {
    data: dataMainMenu,
    isLoading: isLoadingMainMenu,
    refetch: refetchMainMenu,
  } = useAdminCustomQuery<{ type: string; offset: number; limit: number; title?: string }, { data: subListDataType[] }>(
    "/menu/handles",
    [],
    {
      type: query?.type,
      offset: 0,
      limit: 15,
      ...(query?.title ? { title: query?.title } : {}),
    }
  );

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setQuery({ ...query, title: e.target.value });
    }, 400);
  };

  const options = useMemo(() => {
    return [
      {
        icon: <BuildingStorefront />,
        label: "Home",
        action: () => {
          setValue("");
          setShowList(false);
        },
      },
      {
        icon: <SwatchSolid />,
        label: "Collections",
        action: () => {
          setQuery({ ...query, type: "collection" });
          setShowSubList(true);
        },
      },
      {
        icon: <SwatchSolid />,
        label: "Categories",
        action: () => {
          setQuery({ ...query, type: "categories" });
          setShowSubList(true);
        },
      },
      {
        icon: <Tag />,
        label: "Products",
        action: () => {
          setQuery({ ...query, type: "product" });
          setShowSubList(true);
        },
      },
      {
        icon: <DocumentText />,
        label: "Pages",
        action: () => {
          setQuery({ ...query, type: "page" });
          setShowSubList(true);
        },
      },
      // {
      //   icon: <DocumentSeries />,
      //   label: "Policies",
      //   action: () => {
      //     setQuery({ ...query, type: "policy" });
      //     setShowSubList(true);
      //   },
      // },
    ];
  }, []);

  useEffect(() => {
    if (window) {
      const body = document.body;
      body.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const checkTarget = target?.closest(".SearchLink");
        if (!checkTarget) {
          setShowList(false);
          setShowSubList(false);
        }
      });
    }
  }, [window]);

  useEffect(() => {
    setSubListData(dataMainMenu?.data);
  }, [dataMainMenu]);
  return (
    <div className="relative z-0" style={{ zIndex: 0 }}>
      <div className="SearchLink flex items-center gap-2 relative z-0">
        <InputField
          required
          label="Link"
          type="string"
          name="link"
          value={value}
          className="my-6 relative z-0"
          placeholder="Get link"
          onChange={onChangeValue}
          onFocus={() => {
            setShowList(true);
          }}
          onDelete={(e) => {
            setValue("");
            setShowList(false);
            setShowSubList(false);
          }}
          deletable
        />
      </div>
      {showList && (
        <div className="absolute SearchLink w-full z-50" style={{ zIndex: 100 }}>
          {!showSubList && (
            <Container>
              {options?.map((option, i) => {
                return (
                  <div
                    className="SearchLink border-b py-2 cursor-pointer flex gap-2 hover:bg-slate-200"
                    key={i}
                    onClick={() => {
                      onClick("", data);
                      option?.action();
                    }}
                  >
                    {option?.icon}
                    <p>{option?.label}</p>
                  </div>
                );
              })}
            </Container>
          )}
          {showSubList && (
            <Container>
              <div className="overflow-auto max-h-[300px]">
                {subListData?.map((option, i) => {
                  return (
                    <div
                      className="SearchLink border-b py-2 cursor-pointer flex gap-2 hover:bg-slate-200"
                      key={i}
                      onClick={() => {
                        onClick(option?.handle, data);
                        setValue(option?.handle);
                        setShowList(false);
                        setShowSubList(false);
                      }}
                    >
                      <p>{option?.title}</p>
                    </div>
                  );
                })}
              </div>
            </Container>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchLink;
