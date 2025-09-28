import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../config/db'

interface BlogAttributes {
  id: number
  title: string
  slug: string
  content: string
  thumbnail?: string | null
  author?: string | null
  published: boolean
  createdAt?: Date
  updatedAt?: Date
}

type BlogCreationAttributes = Optional<
  BlogAttributes,
  'id' | 'slug' | 'thumbnail' | 'author' | 'published' | 'createdAt' | 'updatedAt'
>

class Blog extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes {
  public id!: number
  public title!: string
  public slug!: string
  public content!: string
  public thumbnail!: string | null
  public author!: string | null
  public published!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'unique_blog_slug',
    },
    content: {
      type: DataTypes.TEXT('long'), // lưu HTML hoặc Markdown
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    updatedAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
  },
  {
    sequelize,
    tableName: 'blogs',
    timestamps: true,
  }
)

export default Blog
