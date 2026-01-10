import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Input,
  Card,
  Row,
  Col,
  Select,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import handleAPI from "../apis/handleAPI";
import BannerForm from "./BannerForm";
import Banner from "../models/Banner";
import Category from "../models/Category";

const fetchBannerDatas = async () => {
  const api = "/api/banners";
  try {
    const res = await handleAPI(api, "get");
    return res;
  } catch (error) {
    console.error("Error fetching Banners:", error);
    return [];
  }
};

const BannerList: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<Banner[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    number | null | "all"
  >("all");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await handleAPI("/api/categories", "get");
        setCategories(res || []);
      } catch (error) {
        message.error("Error loading categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res: any = await fetchBannerDatas();
      if (res && res.length > 0) {
        // Map category names
        const bannersWithCategoryNames = res.map((banner: Banner) => {
          const category = categories.find(
            (cat) => Number(cat.id) === Number(banner.categoryId)
          );
          return {
            ...banner,
            categoryName:
              category?.name || (banner.categoryId ? "Unknown" : "Homepage"),
          };
        });
        setBanners(bannersWithCategoryNames);
        setFilteredBanners(bannersWithCategoryNames);
      } else {
        setBanners([]);
        setFilteredBanners([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [categories]);

  const handleDelete = async (id: string) => {
    try {
      await handleAPI(`/api/banners/${id}`, "delete");
      const updated = banners.filter((banner) => banner.id !== id);
      setBanners(updated);
      setFilteredBanners(updated);
      message.success("Banner deleted successfully!");
    } catch (error) {
      message.error("Error deleting banner");
    }
  };

  const handleAddSuccess = (newBanner: Banner) => {
    const updated = editingBanner
      ? banners.map((b) => (b.id === newBanner.id ? newBanner : b))
      : [...banners, newBanner];
    setBanners(updated);
    setFilteredBanners(updated);
    setEditingBanner(null);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, selectedCategoryFilter);
  };

  const handleCategoryFilter = (value: number | null | "all") => {
    setSelectedCategoryFilter(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = (
    search: string,
    categoryFilter: number | null | "all"
  ) => {
    let filtered = banners;

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (b) =>
          b.id.toLowerCase().includes(search.toLowerCase()) ||
          b.order.toString().includes(search) ||
          b.categoryName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((b) =>
        categoryFilter === null
          ? !b.categoryId
          : b.categoryId === categoryFilter
      );
    }

    setFilteredBanners(filtered);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={image || ""}
          alt="banner"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (categoryName: string) => (
        <Tag color={categoryName === "Homepage" ? "blue" : "green"}>
          {categoryName || "Homepage"}
        </Tag>
      ),
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Banner) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingBanner(record);
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this banner?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <Card
      title="Manage Banner Items"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingBanner(null);
            setModalVisible(true);
          }}
        >
          Add New Banner
        </Button>
      }
      style={{ margin: "20px" }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Input.Search
            placeholder="Search by ID, Order, or Category..."
            style={{ marginBottom: "20px", width: "100%" }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>
        <Col xs={24} md={12}>
          <Select
            placeholder="Filter by Category"
            style={{ width: "100%", marginBottom: "20px" }}
            value={selectedCategoryFilter}
            onChange={handleCategoryFilter}
            options={[
              { value: "all", label: "All Banners" },
              { value: null, label: "Homepage Only" },
              ...categories.map((cat) => ({
                value: Number(cat.id),
                label: cat.name,
              })),
            ]}
          />
        </Col>
        <Col span={24}>
          <Table<Banner>
            columns={columns}
            dataSource={filteredBanners}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Col>
      </Row>

      <BannerForm
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingBanner(null);
        }}
        onSuccess={handleAddSuccess}
        banner={editingBanner}
      />
    </Card>
  );
};

export default BannerList;
