import React from "react";
import "@inovua/reactdatagrid-community/index.css";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  Check,
  Close,
  Download,
  FilterList,
  FilterListOff,
} from "@mui/icons-material";

import RequestRow from "./row";
import NumberFilter from "./numberFilter";
import StringFilter from "./stringFilter";

import DateFilter from "./dateFilter";
import { useState } from "react";
import _ from "lodash";
import { PromotionRequest, RecommendationState } from "@utils/types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

import exportFromJSON from "export-from-json";
import { LoadingEffect } from "@component/ui/loading";

export interface Header {
  id: keyof PromotionRequest | "action";
  label: string;
  sortable?: boolean;
  type: "string" | "number" | "date" | "action";
  formatter?: (value: string, data: PromotionRequest) => string;
  width: number;
  align: "left" | "center" | "right";
  filterEditor?: typeof React.Component | React.FC;
  filterEditorProps?: undefined;
  render?: (
    data: PromotionRequest,
    setExpand: (id: number) => void
  ) => JSX.Element;
}

export interface Filter {
  key: keyof PromotionRequest | "action";
  type: "number" | "string" | "date";
  operation?: string;
  value: any;
}

function CustomTable(props: {
  approveText?: string;
  rejectText?: string;
  hideToolbar?: boolean;
  hideSelection?: boolean;
  fileName?: string;
  requests: PromotionRequest[];
  headers: Header[];
  multipleApprove?: (val: number[]) => void;
  multipleReject?: (val: number[]) => void;
  setRowColor?: (request: PromotionRequest) => string;
  setIndexRowColor?: (index: number) => string | undefined;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  const theme = useTheme();
  const [filter, toggleFilter] = useState<boolean>(false);
  const [expand, setExpand] = useState<number | null>(null);
  const [checked, setChecked] = useState<number[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [sort, setSort] = useState<number>(0);
  const [sortCol, setSortCol] = useState<Header | null>(null);
  const [filteredList, setFilteredList] = useState<PromotionRequest[]>(
    props.requests
  );
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    setTimeout(() => {
      setPage(0);
      setRowsPerPage(10);
      setLoading(false);
    }, 1000);
  }, []);

  React.useEffect(() => {
    setChecked([]);
    setFilteredList(props.requests);
  }, [props.requests]);

  React.useMemo(() => {
    setExpand(null);
    setSortCol(null);
    setPage(0);
    var all_data = props.requests;

    filters.forEach((filter) => {
      var key = filter.key;
      if (key !== "action") {
        all_data = all_data.filter((data) => {
          if (
            filter.type === "string" &&
            key !== "action" &&
            filter.operation &&
            filter.value
          ) {
            if (filter.operation === "CON") {
              return data[key]
                .toLocaleString()
                .toLowerCase()
                .includes(filter.value.toLowerCase());
            } else if (filter.operation === "DNCON") {
              return !data[key]
                .toLocaleString()
                .toLowerCase()
                .includes(filter.value.toLowerCase());
            } else if (filter.operation === "SW") {
              return data[key]
                .toLocaleString()
                .toLowerCase()
                .startsWith(filter.value.toLowerCase());
            } else if (filter.operation === "EW") {
              return data[key]
                .toLocaleString()
                .toLowerCase()
                .endsWith(filter.value.toLowerCase());
            } else if (filter.operation === "EMTY") {
              return data[key];
            } else if (filter.operation === "DEMTY") {
              return data[key];
            } else if (filter.operation === "EQ") {
              return data[key] === filter.value;
            } else if (filter.operation === "DNEQ") {
              return data[key] !== filter.value;
            }
          }

          if (
            filter.type === "number" &&
            key !== "action" &&
            filter.operation
          ) {
            if (filter.operation === "EQ") {
              return data[key] === filter.value;
            } else if (filter.operation === "DNEQ") {
              return data[key] !== filter.value;
            } else if (filter.operation === "GT") {
              return data[key] > filter.value;
            } else if (filter.operation === "LT") {
              return data[key] < filter.value;
            } else if (filter.operation === "LTE") {
              return data[key] <= filter.value;
            } else if (filter.operation === "GTE") {
              return data[key] >= filter.value;
            }
          }

          if (filter.type === "date" && key !== "action" && filter.operation) {
            var date = data[key];
            var filter_value = filter.value;

            if (
              typeof date == "string" &&
              dayjs(date).isValid() &&
              dayjs(filter_value).isValid()
            ) {
              if (filter.operation === "EQ") {
                return dayjs(date).isSame(dayjs(filter.value));
              } else if (filter.operation === "AFT") {
                return dayjs(date).isAfter(dayjs(filter.value));
              } else if (filter.operation === "AFTO") {
                return (
                  dayjs(date).isSame(dayjs(filter.value)) ||
                  dayjs(date).isAfter(dayjs(filter.value))
                );
              } else if (filter.operation === "BEF") {
                return dayjs(date).isBefore(dayjs(filter.value));
              } else if (filter.operation === "BEFO") {
                return (
                  dayjs(date).isSame(dayjs(filter.value)) ||
                  dayjs(date).isBefore(dayjs(filter.value))
                );
              } else if (filter.operation === "DNEQ") {
                return !dayjs(date).isSame(dayjs(filter.value));
              }
            }

            return false;
          }
          return true;
        });
      }
    });

    setFilteredList(all_data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const getHeaderObject = React.useCallback(
    (key: keyof PromotionRequest) => {
      return props.headers.find((obj) => obj.id === key);
    },
    [props.headers]
  );

  const sortData = React.useCallback(
    (sortBy: keyof PromotionRequest, sortType: "asc" | "desc") => {
      setPage(0);
      var header = getHeaderObject(sortBy);

      if (header) {
        if (header.type === "string") {
          let data: PromotionRequest[] = _.cloneDeep(filteredList);

          setFilteredList(
            data.sort((a, b) => {
              if (sortType === "asc") {
                return a[sortBy]
                  ?.toString()
                  .localeCompare(b[sortBy]?.toString());
              }
              return b[sortBy].toString().localeCompare(a[sortBy].toString());
            })
          );
        }

        if (header.type === "number") {
          let data: PromotionRequest[] = _.cloneDeep(filteredList);

          setFilteredList(
            data.sort((a, b) => {
              const a_l = a[sortBy];
              const b_l = b[sortBy];
              if (typeof a_l == "number" && typeof b_l == "number") {
                return sortType === "asc" ? a_l - b_l : b_l - a_l;
              } else {
                return 0;
              }
            })
          );
        }

        if (header.type === "date") {
          let data: PromotionRequest[] = _.cloneDeep(filteredList);

          setFilteredList(
            data.sort((a, b) => {
              const a_l = a[sortBy];
              const b_l = b[sortBy];
              if (typeof a_l == "string" && typeof b_l == "string") {
                const dateA = new Date(a_l);
                const dateB = new Date(b_l);
                return sortType === "asc"
                  ? dateA.getTime() - dateB.getTime()
                  : dateB.getTime() - dateA.getTime();
              } else {
                return 0;
              }
            })
          );
        }
      }
    },
    [filteredList, getHeaderObject]
  );

  const handleToggle = (rowId: number) => {
    setChecked((prevSelectedRows) => {
      if (prevSelectedRows.includes(rowId)) {
        return prevSelectedRows.filter((id) => id !== rowId);
      } else {
        return [...prevSelectedRows, rowId];
      }
    });
  };

  const headers = React.useMemo(() => {
    const header_arr = props.headers.map((header, index) => {
      return (
        <Grid
          key={header.id}
          item
          xs={
            props.hideSelection && header.id === "action"
              ? header.width + 0.5
              : header.width
          }
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "2px",
            paddingRight: "5px",
            paddingLeft: "10px",

            height: "auto",
            ...(index !== 0 && {
              borderLeft: "0.5px solid #e0e0e0",
            }),
          }}
          sx={{
            "&:hover": {
              "& .sort-icon": {
                opacity: "1 !Important",
              },
            },
          }}
        >
          <Tooltip title={header.label}>
            <Typography
              sx={{
                flex: 1,
                justifyContent: header.align,
                textAlign: header.align,
                wordWrap: "break-all",
              }}
            >
              {header.label}
            </Typography>
          </Tooltip>
          {header.id !== "action" && header.sortable && (
            <IconButton
              onClick={() => {
                var id = header.id;

                if (header.id !== sortCol?.id) {
                  setSort(0);
                }

                id !== "action" && setSortCol(header);
                setSort((prev) => (prev + 1) % 3);

                id !== "action" &&
                  sort > 0 &&
                  sortData(id, sort === 1 ? "asc" : "desc");
              }}
              className="sort-icon"
              style={{
                opacity: 0,
                ...(sort > 0 &&
                  sortCol?.id === header.id && {
                    opacity: 1,
                  }),
              }}
              size="small"
            >
              {sortCol?.id === header.id ? (
                sort <= 1 ? (
                  <ArrowUpward
                    fontSize="small"
                    sx={{
                      ...(sort === 0 && { color: "#9695958a" }),
                    }}
                  />
                ) : (
                  <ArrowDownward fontSize="small" />
                )
              ) : (
                <ArrowUpward fontSize="small" sx={{ color: "#9695958a" }} />
              )}
            </IconButton>
          )}
        </Grid>
      );
    });
    return header_arr;
  }, [props.headers, props.hideSelection, sort, sortCol?.id, sortData]);

  const renderFilterOption = (header: Header) => {
    if (header.type === "string") {
      return (
        <StringFilter
          header={header}
          setFilters={setFilters}
          filters={filters}
        />
      );
    }

    if (header.type === "number") {
      return (
        <NumberFilter
          header={header}
          setFilters={setFilters}
          filters={filters}
        />
      );
    }

    if (header.type === "date") {
      return (
        <>
          <DateFilter
            header={header}
            setFilters={setFilters}
            filters={filters}
          />
        </>
      );
    }

    return;
  };

  const dataCount = React.useMemo(() => {
    return filteredList.length;
  }, [filteredList]);

  const processExportData = React.useMemo(() => {
    return filteredList.map((request) => {
      var data: any = {
        "Employee Email": request.employeeEmail,
        "Employee Location": request.location,
        "Promotion Type": request.promotionType,
        "Promotion Statement": request.promotionStatement
          ? request.promotionStatement.replace(/<[^>]+>/g, "")
          : "N/A",
        "Current Designation": request.currentJobRole,
        "Current Job Band": request.currentJobBand,
        "Requested Job Band": request.nextJobBand,
        "Promotion Cycle": request.promotionCycle,
        "Business Unit": request.businessUnit,
        Department: request.department,
        Team: request.team,
        "Sub Team": request.subTeam,
      };

      request.recommendations
        .filter(
          (rec) => rec.recommendationStatus === RecommendationState.SUBMITTED
        )
        .forEach((recommendation, index) => {
          data[index + 1 + " : [Recommendation] Submitted By"] =
            recommendation.leadEmail ? recommendation.leadEmail : "N/A";
          data[index + 1 + " : [Recommendation] Statement "] =
            recommendation.recommendationStatement
              ? recommendation.recommendationStatement.replace(/<[^>]+>/g, "")
              : "N/A";
          data[index + 1 + " : [Recommendation] Additional Comment"] =
            recommendation.recommendationAdditionalComment
              ? recommendation.recommendationAdditionalComment.replace(
                  /<[^>]+>/g,
                  ""
                )
              : "N/A";
        });

      return data;
    });
  }, [filteredList]);

  const paginatedData = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredList.slice(startIndex, endIndex);
  }, [filteredList, page, rowsPerPage]);

  const processRow = React.useMemo(() => {
    if (paginatedData.length === 0) {
      return (
        <Box
          sx={{
            width: "100%",
            height: "50px",
            mt: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5"> No records found </Typography>
        </Box>
      );
    } else {
      const rows = paginatedData.map((request, index) => {
        return (
          <RequestRow
            rowColor={
              props.setIndexRowColor ? props.setIndexRowColor(index) : undefined
            }
            setRowColor={props.setRowColor}
            key={request.id}
            request={request}
            headers={props.headers}
            expand={expand}
            setExpand={setExpand}
            checked={checked.includes(request.id)}
            handleToggle={handleToggle}
            hideSelection={props.hideSelection}
          />
        );
      });
      return rows;
    }
  }, [checked, expand, paginatedData, props]);

  return (
    <>
      {" "}
      {loading ? (
        <LoadingEffect
          message={"Preparing Table View"}
          isCircularLoading={false}
        ></LoadingEffect>
      ) : (
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <>
              {!props.hideToolbar && (
                <Grid item xs={12} sx={{ margin: "0 30px" }}>
                  <Stack direction="row" spacing={2}>
                    {!props.hideSelection && props.multipleApprove && (
                      <Tooltip title="Approve Promotion Request (s)">
                        <span>
                          <Button
                            disabled={checked.length === 0}
                            color="secondary"
                            onClick={() =>
                              props.multipleApprove &&
                              props.multipleApprove(checked)
                            }
                          >
                            {props.approveText ? (
                              props.approveText
                            ) : (
                              <>
                                <Check /> Approve{" "}
                              </>
                            )}
                          </Button>
                        </span>
                      </Tooltip>
                    )}

                    {!props.hideSelection && props.multipleReject && (
                      <Tooltip title="Reject Promotion Request (s)">
                        <span>
                          <Button
                            color="success"
                            disabled={checked.length === 0}
                            onClick={() =>
                              props.multipleReject &&
                              props.multipleReject(checked)
                            }
                          >
                            {props.rejectText ? (
                              props.rejectText
                            ) : (
                              <>
                                <Close /> Reject
                              </>
                            )}
                          </Button>
                        </span>
                      </Tooltip>
                    )}

                    <Tooltip title="Export">
                      <Button
                        color="success"
                        onClick={() =>
                          exportFromJSON({
                            data: processExportData,
                            fileName: props.fileName
                              ? filter
                                ? props.fileName + "(filtered)"
                                : props.fileName + "(all)"
                              : "request",
                            exportType: exportFromJSON.types.csv,
                          })
                        }
                      >
                        <Download /> Export
                      </Button>
                    </Tooltip>

                    <Tooltip title="Setup filter Conditions">
                      {/* <StyledBadge badgeContent={4} color="primary"> */}
                      <Button
                        color="success"
                        onClick={() => toggleFilter(!filter)}
                      >
                        <FilterList /> Filter
                      </Button>
                      {/* </StyledBadge> */}
                    </Tooltip>

                    {filters.length > 0 && (
                      <Tooltip title="Clear Filters">
                        <Button
                          color="success"
                          onClick={() => {
                            toggleFilter(!filter);
                            setFilters([]);
                          }}
                        >
                          <FilterListOff /> Clean Filters
                        </Button>
                      </Tooltip>
                    )}
                  </Stack>
                </Grid>
              )}

              {/* header */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "auto",
                    background:
                      theme.palette.mode === "light" ? "#c9d0d7" : "#3C4858",
                    m: "0 11px",
                    marginTop: "20px",
                    borderRadius: "5px 5px 0 0",

                    p: "5px 18px",
                  }}
                >
                  <Grid container sx={{ m: 0 }}>
                    {!props.hideSelection && (
                      <Grid
                        item
                        xs={0.3}
                        sx={{
                          display: "flex",
                        }}
                      >
                        <Checkbox
                          sx={{ m: 0 }}
                          checked={
                            props.requests.length > 0 &&
                            props.requests.length === checked.length
                          }
                          indeterminate={
                            checked.length > 0 &&
                            props.requests.length !== checked.length
                          }
                          onClick={() => {
                            if (props.requests.length === checked.length) {
                              setChecked([]);
                            } else {
                              setChecked(props.requests.map((req) => req.id));
                            }
                          }}
                        />
                      </Grid>
                    )}
                    {headers}
                  </Grid>
                </Box>
              </Grid>

              {/* filter */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "auto",
                    margin: "0 11px",
                    borderBottom: "1px dashed #e3e3e3",
                    p: filter ? "5px 20px" : "0px 20px",
                    background:
                      theme.palette.mode === "light" ? "#c9d0d7" : "#3C4858",
                  }}
                >
                  {filter && (
                    <Grid container sx={{}}>
                      {!props.hideSelection && (
                        <Grid
                          item
                          xs={0.3}
                          style={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                          }}
                        ></Grid>
                      )}

                      {props.headers.map((header, index) => {
                        return (
                          <Grid
                            key={header.id}
                            item
                            xs={header.width}
                            style={{
                              ...(index !== 0 && {
                                borderLeft: "0.5px solid #e0e0e0",
                              }),
                              display: "flex",
                              justifyContent: header.align,
                              alignItems: "center",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {renderFilterOption(header)}
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  overflow: "auto",
                  flex: 1,
                  borderBottom: "1px solid rgb(232, 231, 231)",
                }}
              >
                {processRow}
              </Grid>
            </>
          </LocalizationProvider>
          <TablePagination
            component="div"
            count={dataCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </>
  );
}

export default CustomTable;
