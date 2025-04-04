import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { Text, Flex, Box, Grid, Button, Dialog, TextField, Heading, Inset } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { themeQuartz, colorSchemeDarkBlue, AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';

import Panel from '../components/Panel';
import PreviewFrame from '../components/PreviewFrame';
import { useAuth } from "../hooks/AuthProvider";

ModuleRegistry.registerModules([AllCommunityModule]);

function TravelPlannerHome() {

  const auth = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTravelPlanTitle, setNewTravelPlanTitle] = useState("");


  // Row Data: The data to be displayed.
  const [travelPlans, setTravelPlans] = useState([]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    {
      field: "id",
      resizable: false,
      sortable: true,
      flex: 0.5,
      cellDataType: 'number',
    },
    {
      field: "title",
      resizable: false,
      sortable: true,
      flex: 2,
      cellDataType: 'text',
    },
    {
      field: "start_date",
      resizable: false,
      sortable: true,
      flex: 1,
      cellDataType: 'dateString',
    },
    {
      field: "end_date",
      resizable: false,
      sortable: true,
      flex: 1,
      cellDataType: 'dateString',
    },
    {
      field: "description",
      resizable: false,
      sortable: true,
      flex: 2,
      cellDataType: 'text',
    },
  ]);

  const getTravelPlans = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}travel/`, {
        headers: {
          Authorization: `Token ${auth.token}`,
        },
      })
      .then(response => {
        const data = response.data.map((item) => ({
          id: item.id,
          title: item.title,
          start_date: item.start_date,
          end_date: item.end_date,
          description: item.description,
        }));
        setTravelPlans(data);
      })
      .catch(error => {
        console.error("Error fetching travels:", error);
      });
  };

  // Fetch Travel Plans when the component mounts
  useEffect(() => {
    getTravelPlans();
  }, []);

  const handleCreateTravelPlan = async () => {

    axios
      .post(`${import.meta.env.VITE_API_URL}travel/`, {
        title: newTravelPlanTitle,
      }, {
        headers: {
          Authorization: `Token ${auth.token}`,
        },
      })
      .then(response => {
        setNewTravelPlanTitle("");
        setIsDialogOpen(false);
        getTravelPlans();
      });

  };

  const gridTheme = themeQuartz
    .withPart(colorSchemeDarkBlue)
    .withParams({
      headerHeight: 50,
      rowHeight: 50,
      fontSize: 16,
      backgroundColor: 'rgba(40, 40, 40, 0.22)',
      width: "100%",
      height: `${travelPlans.length * 50}px`
    });

  return (
    <Panel>

      <Box asChild width="100%" my="60px">
        <Flex direction="column" align="start" gap="60px">
          <Box asChild width="100%" p="100px">
            <Flex
              direction="column"
              align="start"
              justify="center"
              gap="40px"
              style={{
                width: "100%",
                backgroundImage: "url('/images/sky.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center", // Center the image to handle sidebar collapse
                backgroundRepeat: "no-repeat", // Prevent tiling
                marginTop: "-60px",
                position: "relative", // Added for positioning the shadow
              }}>
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(to right, rgba(59, 58, 58, 0.85), rgba(0, 0, 0, 0))", // Shadow effect
                  zIndex: 1,
                }}
              />
              <Flex
                direction="column"
                align="start"
                justify="center"
                gap="40px"
                style={{
                  position: "relative", // Ensure content is above the shadow
                  zIndex: 2,
                }}>
                <Heading size="8" color="white">
                  Travel Planner
                </Heading >
                <Box asChild width="100%">
                  <Text size="5" >
                    Plan your trips effortlessly with our travel planner.<br />
                    Create, view, and manage your travel plans all in one place.
                  </Text>
                </Box>

                <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>

                  <Dialog.Trigger asChild>
                    <Box asChild height="60px" px="30px">
                      <Button size="3" variant="solid">
                        <Text size="5" weight="medium">
                          Create New Travel Plan
                        </Text>
                      </Button>
                    </Box>
                  </Dialog.Trigger>

                  <Flex asChild direction="column" gap="10px">
                    <Dialog.Content size="3" maxWidth="450px">
                      <Box asChild p="4px">
                        <Dialog.Title>Create New Travel Plan</Dialog.Title>
                      </Box>
                      <Box asChild height="40px">
                        <TextField.Root
                          value={newTravelPlanTitle}
                          onChange={(e) => setNewTravelPlanTitle(e.target.value)}
                          placeholder="Enter title for your new travel plan...">
                          <TextField.Slot pl="8px" />
                          <TextField.Slot pr="8px" />
                        </TextField.Root>
                      </Box>


                      <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                          <Box asChild px="20px">
                            <Button size="3" variant="soft" color="gray">
                              Cancel
                            </Button>
                          </Box>

                        </Dialog.Close>
                        <Box asChild px="20px">
                          <Button size="3" onClick={handleCreateTravelPlan}>
                            Create
                          </Button>
                        </Box>
                      </Flex>
                    </Dialog.Content>
                  </Flex>
                </Dialog.Root>
              </Flex>
            </Flex>
          </Box>

          {travelPlans.length !== 0 && (
            <Box asChild width="100%" px="60px">
              <Heading size="7" weight="medium">
                Continue planning your next journey...
              </Heading>
            </Box>
          )}

          {travelPlans.length !== 0 && (
            <Grid flow="column" rows="1" gap="6" px="60px">
              {travelPlans.map((travelPlan, index) => (
                <PreviewFrame
                  key={index} // Added unique key prop
                  linkUrl={`${travelPlan.id}`}
                  title={travelPlan.title}
                  imageUrl={travelPlan.imageUrl}
                />
              ))}
            </Grid>
          )}

          <Box asChild width="100%" px="60px">
            <Heading size="7" weight="medium">
              All trips
            </Heading>
          </Box>

          <Box width="100%" px="60px" style={{ overflowX: "auto" }}>
            {travelPlans.length === 0 ? (
              <Box asChild width={"100%"} mt="60px" mb="100px">
                <Text size="5" weight="regular">
                  <i>No travel plans available.</i>
                </Text>
              </Box>
            ) : (
              <AgGridReact
                theme={gridTheme}
                rowData={travelPlans}
                columnDefs={colDefs}
                domLayout="autoHeight"
              />
            )}
          </Box>
          {/*  */}
        </Flex>
      </Box>
    </Panel>
  );
}

export default TravelPlannerHome;
