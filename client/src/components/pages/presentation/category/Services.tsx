import { Tabs } from "antd";
import ServicesCategory from "./ServiceCategory";
import Services from "./Category";
import { motion } from "framer-motion";
import "./Category.css";

const { TabPane } = Tabs;

function Category() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="category-container"
    >
      <div className="w-full mx-auto">
        <Tabs
          defaultActiveKey="1"
          centered
          animated={{ inkBar: true, tabPane: true }}
          className="custom-tabs"
          tabBarStyle={{
            marginBottom: 0,
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <TabPane
            tab={
              <motion.div whileHover={{ scale: 1.05 }} className="tab-title">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  Services
                </span>
              </motion.div>
            }
            key="1"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <ServicesCategory />
            </motion.div>
          </TabPane>

          <TabPane
            tab={
              <motion.div whileHover={{ scale: 1.05 }} className="tab-title">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Category
                </span>
              </motion.div>
            }
            key="2"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <Services onItemClick={() => {}} />
            </motion.div>
          </TabPane>
        </Tabs>
      </div>
    </motion.div>
  );
}

export default Category;
