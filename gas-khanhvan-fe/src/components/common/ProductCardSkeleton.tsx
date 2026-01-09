import React from "react";
import { Card, Col, Row, Skeleton } from "antd";

interface ProductCardSkeletonProps {
  count?: number;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number; // Added xl breakpoint support
  };
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  count = 8,
  columns = { xs: 12, sm: 12, md: 8, lg: 4 },
}) => {
  return (
    <Row gutter={[16, 16]}>
      {Array.from({ length: count }).map((_, index) => (
        <Col key={index} {...columns}>
          <Card
            style={{ borderRadius: 12, overflow: "hidden" }}
            cover={
              <Skeleton.Image active style={{ width: "100%", height: 200 }} />
            }
          >
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductCardSkeleton;
