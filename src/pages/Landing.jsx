/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
    Box,
    Button,
    Input,
    Stack,
    Select,
    FormLabel,
    FormControl,
    SimpleGrid,
    GridItem,
    Textarea,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Landing = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        fromDate: '',
        toDate: '',
        country: 'IN',
        inOut: 'import',
        buyerName: 'AASHITA',
        hsCode: '',
        supplierName: '',
        originCountry: '',
        proDesc: '',
        billNo: '',
        email: 'test@example.com', // Set this constant or allow user input as needed
    });

    // Modal control hooks
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalMessage, setModalMessage] = useState('');

    // Handle form input
    const handleFormInput = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data for API request
        const postData = {
            email: formData.email,
            from_date: formData.fromDate,
            to_date: formData.toDate,
            country: formData.country,
            in_out: formData.inOut.charAt(0).toUpperCase() + formData.inOut.slice(1),
            buyer_name: formData.buyerName,
            hs_code: formData.hsCode,
            supplier_name: formData.supplierName,
            origin_country: formData.originCountry,
            pro_desc: formData.proDesc,
            bill_no: formData.billNo,
        };

        try {
            const sessionToken = localStorage.getItem('sessionToken'); // Ensure token is retrieved correctly

            if (!sessionToken) {
                toast.error('Session token is missing.');
                return;
            }

            // API request with session token
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/search`, postData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`, // Send the token with the request
                },
            });

            const messageCode = response.data.messageCode; // Adjust based on your API response structure

            // Handle success response and open modal
            setModalMessage(`Request received! Processing status: ${messageCode}`);
            onOpen(); // Open the modal

            // Optionally, you can navigate to a different page if needed after displaying the modal
            // navigate('/search-results', { state: { results: response.data } });

        } catch (error) {
            // Handle errors based on the response
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error('Invalid search parameters.');
                } else if (error.response.status === 401) {
                    toast.error('Unauthorized. Please log in again.');
                } else {
                    toast.error('Failed to submit search. Please try again later.');
                }
            } else {
                toast.error('Network error. Please check your connection.');
            }
            console.error('Error submitting search:', error);
        }
    };

    return (
        <>
            <Navbar />
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                p={4}
                bg="gray.100"
                minH="calc(100vh - 14vh)"
            >
                <Box
                    as="form"
                    onSubmit={handleSubmit}
                    width="full"
                    maxW="5xl"
                    p={4}
                    bg="white"
                    borderRadius="lg"
                    boxShadow="lg"
                >
                    <SimpleGrid columns={{ base: 1, md: 3 }} m={6} spacing={6} spacingX={24}>
                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">From Date</FormLabel>
                                <Input
                                    type="date"
                                    name="fromDate"
                                    value={formData.fromDate}
                                    onChange={handleFormInput}
                                    size="md"
                                    bg="gray.50"
                                    _hover={{ borderColor: 'blue.400' }}
                                    fontSize="sm"
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">To Date</FormLabel>
                                <Input
                                    type="date"
                                    name="toDate"
                                    value={formData.toDate}
                                    onChange={handleFormInput}
                                    size="md"
                                    bg="gray.50"
                                    _hover={{ borderColor: 'blue.400' }}
                                    fontSize="sm"
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">Country</FormLabel>
                                <Select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleFormInput}
                                    size="md"
                                    bg="gray.50"
                                    _hover={{ borderColor: 'blue.400' }}
                                    fontSize="sm"
                                >
                                    <option value="IN">India (IN)</option>
                                    {/* Add more options if necessary */}
                                </Select>
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">In/Out</FormLabel>
                                <Select
                                    name="inOut"
                                    value={formData.inOut}
                                    onChange={handleFormInput}
                                    size="md"
                                    bg="gray.50"
                                    _hover={{ borderColor: 'blue.400' }}
                                    fontSize="sm"
                                >
                                    <option value="import">Import</option>
                                    <option value="export">Export</option>
                                </Select>
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">Buyer Name</FormLabel>
                                <Input
                                    type="text"
                                    name="buyerName"
                                    value={formData.buyerName}
                                    onChange={handleFormInput}
                                    size="md"
                                    bg="gray.50"
                                    _hover={{ borderColor: 'blue.400' }}
                                    fontSize="sm"
                                    placeholder="Enter buyer name"
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">HS Code</FormLabel>
                                <Input
                                    type="text"
                                    name="hsCode"
                                    value={formData.hsCode}
                                    onChange={handleFormInput}
                                    size="md"
                                    bg="gray.50"
                                    _hover={{ borderColor: 'blue.400' }}
                                    fontSize="sm"
                                    placeholder="Enter HS code"
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">Supplier Name</FormLabel>
                                <Input
                                    type="text"
                                    name="supplierName"
                                    value={formData.supplierName}
                                    onChange={handleFormInput}
                                    size="md"
                                    bg="gray.50"
                                    _hover={{ borderColor: 'blue.400' }}
                                    fontSize="sm"
                                    placeholder="Enter supplier name"
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">Origin Country</FormLabel>
                                <Input
                                    type="text"
                                    name="originCountry"
                                    value={formData.originCountry}
                                    onChange={handleFormInput}
                                    size="md"
                                    bg="gray.50"
                                    _hover={{ borderColor: 'blue.400' }}
                                    fontSize="sm"
                                    placeholder="Enter origin country"
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize="sm" fontWeight="medium">Bill No</FormLabel>
                                <Input
                                    type="text"
                                    name="billNo"
                                    value={formData.billNo}
                                    onChange={handleFormInput}
                                    size="md"
                                    bg="gray.50"
                                    _hover={{ borderColor: 'blue.400' }}
                                    fontSize="sm"
                                    placeholder="Enter bill number"
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={{ base: 1, md: 3 }}>
                            <Flex>
                                <FormControl flex="2" mr={4}>
                                    <FormLabel fontSize="sm" fontWeight="medium">Product Description</FormLabel>
                                    <Textarea
                                        name="proDesc"
                                        value={formData.proDesc}
                                        onChange={handleFormInput}
                                        size="md"
                                        bg="gray.50"
                                        _hover={{ borderColor: 'blue.400' }}
                                        fontSize="sm"
                                        placeholder="Enter product description"
                                        resize="vertical"
                                    />
                                </FormControl>

                                <FormControl flex="1" alignSelf="flex-end">
                                    <Button
                                        type="submit"
                                        colorScheme="blue"
                                        size="lg"
                                        w="auto"
                                        mt={4}
                                        bg="blue.500"
                                        _hover={{ bg: 'blue.600' }}
                                        _active={{ bg: 'blue.700' }}
                                    >
                                        Search
                                    </Button>
                                </FormControl>
                            </Flex>
                        </GridItem>
                    </SimpleGrid>
                </Box>

                {/* Modal for showing the message */}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Request Received</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {modalMessage}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </>
    );
};

export default Landing;
