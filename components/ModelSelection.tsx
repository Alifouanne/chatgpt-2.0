"use client";
import Select from "react-select";
import useSWR from "swr";
const fetchModels = async () => {
  return fetch("/api/getEngines").then((res) => res.json());
};
const ModelSelection = () => {
  const { data: models, isLoading } = useSWR("models", fetchModels);
  const { data: model, mutate: setModel } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });
  return (
    <div>
      <Select
        className="mt-2"
        isSearchable
        isLoading={isLoading}
        menuPosition="fixed"
        classNames={{
          control: (state) => "bg-[#434654] border-[#434654]",
        }}
        defaultValue={model}
        placeholder={model}
        options={models?.modelOptions}
        onChange={(e) => setModel(e.value)}
        aria-label="select model"
      />
    </div>
  );
};

export default ModelSelection;
