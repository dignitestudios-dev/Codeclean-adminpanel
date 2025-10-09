import React from 'react'

const Documentation = () => {
  return (
    <div className="documentation-container max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">Super Admin Panel Documentation</h1>

      <p className="text-lg text-gray-700 text-center mb-6">
        The "Super Admin Panel" is a powerful web-based control center that enables administrators to manage and monitor all aspects of the app's operations.
        Below are the core features of the Super Admin Panel:
      </p>

      <div className="feature-card bg-gray-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">1. Push Notifications</h2>
        <p className="text-lg text-gray-600">
          The Super Admin Panel allows administrators to send real-time push notifications to users. These notifications can be targeted to specific users or groups, ensuring important updates are communicated effectively.
        </p>
      </div>

      <div className="feature-card bg-gray-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">2. User Management</h2>
        <p className="text-lg text-gray-600">
          Admins can manage user profiles, including viewing, editing, and deleting them. User activity can also be monitored for ensuring compliance with platform policies.
        </p>
      </div>

      <div className="feature-card bg-gray-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">3. Content Management</h2>
        <p className="text-lg text-gray-600">
          Administrators have full control over the app’s content. They can add, edit, or delete content as required, and update platform information.
        </p>
      </div>

      <div className="feature-card bg-gray-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">4. Report Generation</h2>
        <p className="text-lg text-gray-600">
          Admins can generate reports related to app revenue, user statistics, and more. These reports can be downloaded for informed decision-making.
        </p>
      </div>

      <div className="feature-card bg-gray-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">5. Verification of Service Providers</h2>
        <p className="text-lg text-gray-600">
          Admins are responsible for verifying the credentials of service providers to ensure they meet the platform’s standards. This process includes reviewing experience and certifications before approval.
        </p>
      </div>

      <div className="feature-card bg-gray-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">6. Withdrawal Request Management</h2>
        <p className="text-lg text-gray-600">
          The admin can manage and verify withdrawal requests from users and service providers, ensuring compliance with platform policies and processing payments securely.
        </p>
      </div>

      <div className="feature-card bg-gray-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">7. Reviews Monitoring</h2>
        <p className="text-lg text-gray-600">
          Admins have the ability to monitor user and service provider reviews. This feedback helps assess service quality and user satisfaction, and admins can address any issues promptly.
        </p>
      </div>

      <div className="feature-card bg-gray-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">8. Reports Monitoring</h2>
        <p className="text-lg text-gray-600">
          Admins monitor and review reports submitted by users or service providers. This includes complaints about unprofessional behavior, technical issues, or violations. Admins are responsible for investigating and resolving these concerns.
        </p>
      </div>
    </div>
  )
}

export default Documentation
