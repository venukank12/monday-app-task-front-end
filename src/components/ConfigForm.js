import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Button, Box, Dropdown, Text, Flex, Chips } from "monday-ui-react-core";
import mondayClient, { getAvailableColumns } from "../services/mondayClient";
import { GET_COLUMS } from "../gql/query";
import API from "../services/api";

const ConfigForm = ({ userId, boardId }) => {
  const [availableColumns, setAvailableColumns] = useState([]);
  const [duplicateActionType, setDuplicateActionType] = useState([]);
  const actionFieldRef = useRef();
  const columnFieldRef = useRef();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRes = await getAvailableColumns(GET_COLUMS(boardId));
        setAvailableColumns(
          colRes.data.boards?.[0]?.columns?.map((column) => ({
            label: column.title,
            value: column.id,
          }))
        );

        const dupActRes = await API.get("/config-action-type");
        setDuplicateActionType(
          dupActRes.data.data.map((actionType) => ({
            label: actionType.name,
            value: actionType._id,
          }))
        );
      } catch (e) {
        mondayClient.execute("notice", {
          message: "Could not load App, Try reload again!",
          type: "error", // or "error" (red), or "info" (blue)
          timeout: 10000,
        });
      }
    };

    userId && boardId && fetchData();
  }, [userId, boardId]);

  const handleSaveConfig = useCallback(() => {
    setLoading(true);
    setError(null);
    if (
      !actionFieldRef.current.state.value ||
      !columnFieldRef.current.state.value
    ) {
      setError("Please select both fields!");
      setLoading(false);
      return;
    }

    mondayClient
      .execute("confirm", {
        message:
          "Save your Configurations, Selected Configrations will be saved and effect immediately, Do you proceeds?",
        confirmButton: "Yes, Save",
        cancelButton: "No, Skip",
        excludeCancelButton: false,
      })
      .then(async (res) =>
        res.data.confirm
          ? API.post("/config/add-or-update", {
              userId,
              boardId,
              configType: "COLUMN_TO_WATCH_DUPLICATE",
              configField: columnFieldRef.current.state.value.value,
              configActionType: actionFieldRef.current.state.value.value,
            })
              .then((res) => {
                mondayClient.execute("notice", {
                  message: "Your configurations has been updated successfully!",
                  type: "success", // or "error" (red), or "info" (blue)
                  timeout: 10000,
                });
                setLoading(false);
              })
              .catch((err) => {
                mondayClient.execute("notice", {
                  message:
                    "Could not save your configurations, please try again!",
                  type: "error", // or "error" (red), or "info" (blue)
                  timeout: 10000,
                });
                setLoading(false);
              })
          : setLoading(false)
      )
      .catch((err) => setLoading(false));
  }, [userId, boardId]);

  return (
    <Box margin={Box.margins.XXL} padding={Box.paddings.MEDIUM}>
      <Text
        align={Text.align.CENTER}
        type={Text.types.TEXT1}
        weight={Text.weights.BOLD}
      >
        Your Configurations,
      </Text>
      <Box marginTop={Box.marginTops.XL} />
      <Text type={Text.types.TEXT1}>01. Look for duplicates in :</Text>
      <Text type={Text.types.TEXT2}>
        Please select the column which you need to be unique
      </Text>
      <Box marginTop={Box.marginTops.SMALL} />
      <div>
        <Dropdown
          ref={columnFieldRef}
          placeholder="Select column"
          size={Dropdown.sizes.MEDIUM}
          className="dropdown-stories-styles_spacing"
          options={availableColumns}
        />
      </div>
      <Box marginTop={Box.marginTops.XL} />
      <Text type={Text.types.TEXT1}>02. When a duplicate is detected :</Text>
      <Text type={Text.types.TEXT2}>
        Please select the action to perform for that duplicate
      </Text>
      <Box marginTop={Box.marginTops.SMALL} />
      <div
        style={{
          height: "150px",
        }}
      >
        <Dropdown
          ref={actionFieldRef}
          className="dropdown-stories-styles_spacing"
          placeholder="Select action"
          size={Dropdown.sizes.MEDIUM}
          options={duplicateActionType}
        />
      </div>

      {error && (
        <Flex
          justify={Flex.justify.CENTER}
          style={{
            width: "100%",
            margin: "21px 0px",
          }}
        >
          <Chips label={error} color={Chips.colors.NEGATIVE} />
        </Flex>
      )}
      <Flex
        justify={Flex.justify.CENTER}
        style={{
          width: "100%",
        }}
      >
        <Button
          disabled={Boolean(
            loading || duplicateActionType.length === 0 || availableColumns.length === 0
          )}
          onClick={handleSaveConfig}
        >
          Save Config
        </Button>
      </Flex>
    </Box>
  );
};
export default memo(ConfigForm);
